---
title: LinkWave — Migração Supabase para Neon
aliases:
  - LinkWave Supabase to Neon
tags:
  - linkwave
  - database
  - neon
  - prisma
  - migration
status: draft
date: 2026-06-29
---

# LinkWave — Migração do banco Supabase para Neon

> [!danger] Não executar o cutover ainda
> O repositório está parcialmente migrado, mas há bloqueios de identidade, schema e cadastro. Corrija e teste os itens deste documento antes de apontar produção para o Neon.

## 1. Decisão de arquitetura

Stack temporária recomendada:

| Responsabilidade | Serviço |
|---|---|
| Aplicação | Next.js |
| Banco relacional | Neon Postgres |
| ORM e migrations | Prisma |
| Autenticação e sessão | Firebase Auth |
| Upload de avatar/banner | Cloudinary |
| Supabase | Somente fonte da migração e rollback temporário |

O Neon substitui apenas o **Postgres do Supabase**. Ele não substitui Supabase Auth, Storage, Realtime ou Edge Functions. No código atual, Firebase já assumiu autenticação e Cloudinary já assumiu uploads; portanto, a separação acima é possível.

## 2. Estado real do repositório

### Já migrado ou encaminhado

- `prisma/schema.prisma` modela `users`, `profiles`, `links`, `clicks` e `registration_rate_limits`.
- A maior parte de `src/` consulta dados usando Prisma.
- `@prisma/adapter-neon`, `@neondatabase/serverless` e Prisma já estão instalados.
- Login, sessões e proteção de páginas usam Firebase (`__session`).
- Avatar e banner ativos usam Cloudinary.
- Middleware ativo usa `src/lib/auth/middleware.ts`, não o middleware Supabase.

### Supabase ainda ativo

- `src/lib/security/rate-limit.ts` lê e grava `registration_rate_limits` via Supabase.
- `src/app/api/test/login/route.ts` e `src/app/api/test/ci-login/route.ts` ainda dependem de Supabase Auth.
- `src/lib/supabase/`, `src/lib/supabaseClient.ts` e pacotes Supabase permanecem no projeto.
- Textos da UI, README, testes E2E e documentação ainda dizem Supabase.
- O diretório `web/` é uma aplicação legada separada e continua fortemente acoplado ao Supabase. Ele não deve fazer parte do cutover da aplicação raiz sem uma decisão explícita.

### Configuração ausente

- `.env.local` não contém `DATABASE_URL`.
- `.env.example` não documenta Neon, Firebase ou Cloudinary.
- Não existe `prisma/migrations/`; há schema Prisma, mas nenhuma migration versionada.

## 3. Bloqueios obrigatórios

### 3.1 Identidade: Firebase UID versus UUID

O schema atual declara:

```prisma
model User {
  id String @id @default(uuid()) @db.Uuid
}
```

e todas as relações `userId` também usam `@db.Uuid`.

Ao mesmo tempo, o código usa `authUser.uid` do Firebase diretamente como `User.id`. UIDs gerados normalmente pelo Firebase não são UUIDs Postgres. Isso pode quebrar cadastro, consultas e chaves estrangeiras.

Escolher **uma** estratégia antes de migrar:

#### Estratégia A — recomendada para menor refatoração imediata

Manter IDs UUID no banco e criar cada usuário Firebase com o mesmo UUID:

1. gerar `const userId = crypto.randomUUID()`;
2. chamar Firebase Admin `createUser({ uid: userId, ... })`;
3. criar `User` e `Profile` no Neon usando `userId`;
4. na importação, criar/importar os usuários Firebase preservando o UUID do Supabase como UID.

Essa estratégia exige auditar usuários já existentes no Firebase. Qualquer UID não UUID precisa ser recriado/mapeado antes do cutover.

#### Estratégia B — mais robusta no longo prazo

Separar identidade externa da chave interna:

```prisma
model User {
  id          String @id @default(uuid()) @db.Uuid
  firebaseUid String @unique @map("firebase_uid")
}
```

Depois, resolver `firebaseUid -> User.id` em toda operação autenticada. É mais correta para trocar provedores de autenticação no futuro, mas exige refatorar todas as ações e rotas que hoje usam `authUser.uid` como ID relacional.

> [!warning] Não recomendo apenas transformar todos os IDs em `text`
> Isso funciona, mas mistura a identidade do provedor com a chave do domínio e dificulta futuras trocas de autenticação.

### 3.2 Cadastro incompleto

`registerUserAction()` cria o usuário no Firebase e faz `prisma.profile.upsert()`, mas não cria `prisma.user` antes. Como `profiles.user_id` referencia `users.id`, o cadastro falha em um banco com a foreign key correta.

O fluxo deve ser transacional:

1. criar usuário Firebase com o ID escolhido;
2. executar uma transação Prisma;
3. criar `User`;
4. criar `Profile`;
5. se o banco falhar, remover o usuário recém-criado do Firebase.

Aplicar o mesmo princípio ao cadastro pelo painel admin.

### 3.3 Schema Prisma não preserva todas as regras SQL

O schema Supabase possui regras que não aparecem integralmente no Prisma:

- índices case-insensitive únicos para email e username;
- checks de `role`, `theme`, tamanho de bio, tamanho de título e formato da URL;
- índices de consultas de links e clicks;
- tipo `inet` para IP;
- trigger de `updated_at`;
- geração de username único;
- RLS e policies.

As regras de integridade importantes devem virar migrations SQL do Prisma. Não confiar apenas em validação TypeScript.

### 3.4 RLS não será transportado como está

As policies usam `auth.uid()` e `auth.role()`, funções fornecidas pelo Supabase. Elas não funcionam diretamente no Neon.

Como a aplicação acessa o Neon pelo servidor via Prisma, autorização deve ser aplicada nas queries:

- sempre filtrar mutações por `userId`;
- verificar ownership antes de update/delete;
- nunca disponibilizar `DATABASE_URL` ao navegador;
- usar um usuário de banco com privilégios mínimos em runtime;
- manter rotas públicas explicitamente somente-leitura.

Não restaurar policies Supabase no Neon sem reescrevê-las.

## 4. Plano por fases

## Fase 0 — Segurança e rollback

- [ ] Criar branch Git dedicada.
- [ ] Commitar ou guardar as alterações atuais antes de continuar.
- [ ] Registrar contagens por tabela no Supabase.
- [ ] Fazer backup lógico e manter o Supabase intacto.
- [ ] Definir janela de manutenção ou modo somente leitura.
- [ ] Não remover chaves Supabase antes da validação final.
- [ ] Nunca colocar connection strings reais neste arquivo ou no Git.

Consultas de inventário:

```sql
select 'users' as tabela, count(*) from public.users
union all select 'profiles', count(*) from public.profiles
union all select 'links', count(*) from public.links
union all select 'clicks', count(*) from public.clicks
union all select 'registration_rate_limits', count(*) from public.registration_rate_limits;
```

Verificar órfãos:

```sql
select count(*) from public.profiles p
left join public.users u on u.id = p.user_id
where u.id is null;

select count(*) from public.links l
left join public.users u on u.id = l.user_id
where u.id is null;

select count(*) from public.clicks c
left join public.users u on u.id = c.user_id
where u.id is null;
```

## Fase 1 — Preparar Neon

- [ ] Criar projeto Neon na região próxima à aplicação.
- [ ] Criar branch `migration-staging`.
- [ ] Copiar a connection string pooled para runtime.
- [ ] Copiar uma connection string direct/unpooled para migrations e dump/restore.
- [ ] Configurar localmente:

```dotenv
DATABASE_URL="postgresql://...-pooler.../neondb?sslmode=require"
DIRECT_URL="postgresql://.../neondb?sslmode=require"
```

- [ ] Adicionar as mesmas variáveis no ambiente de preview/produção.
- [ ] Atualizar `.env.example` apenas com placeholders.

> [!note] Conexões
> Use URL pooled para a aplicação serverless e URL direct para operações administrativas, `pg_dump`, `pg_restore` e migrations.

## Fase 2 — Corrigir o modelo antes de copiar dados

- [ ] Escolher Estratégia A ou B para identidade.
- [ ] Corrigir cadastro normal e cadastro admin.
- [ ] Migrar o rate limit para Prisma.
- [ ] Desativar ou reescrever as rotas de teste Supabase.
- [ ] Tornar a inicialização do Prisma lazy para o build não avaliar o cliente sem `DATABASE_URL`.
- [ ] Adicionar constraints e índices ausentes em uma migration SQL.
- [ ] Garantir unicidade case-insensitive de email e username.

Exemplo de índices que precisam ser preservados:

```sql
create unique index if not exists users_username_lower_idx
  on users (lower(username));
create unique index if not exists users_email_lower_idx
  on users (lower(email));
create unique index if not exists profiles_username_lower_idx
  on profiles (lower(username));
create index if not exists links_user_order_idx
  on links (user_id, order_position);
create index if not exists clicks_user_created_idx
  on clicks (user_id, created_at desc);
create index if not exists clicks_link_created_idx
  on clicks (link_id, created_at desc);
```

Criar a primeira migration somente depois de alinhar o schema:

```bash
npx prisma format
npx prisma migrate dev --name init_neon
npx prisma generate
```

Em CI/produção:

```bash
npx prisma migrate deploy
```

> [!warning] Banco vazio versus banco restaurado
> Não aplique cegamente uma migration de criação sobre tabelas já restauradas. Escolha uma ordem:
> 1. criar schema via Prisma e importar somente dados; ou
> 2. restaurar schema+dado e então fazer baseline da migration.
>
> Para este projeto, a opção 1 é mais controlável porque o schema Supabase contém dependências de `auth`, `storage` e RLS que não pertencem ao Neon.

## Fase 3 — Exportar apenas dados da aplicação

Não copiar `auth`, `storage`, `realtime`, roles ou policies do Supabase para Neon.

Obter a URL direta/session do banco Supabase e exportar somente as tabelas públicas necessárias:

```bash
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --format=custom \
  --no-owner \
  --no-privileges \
  --table=public.users \
  --table=public.profiles \
  --table=public.links \
  --table=public.clicks \
  --table=public.registration_rate_limits \
  --file=linkwave-data.dump
```

Restaurar na branch de staging do Neon:

```bash
pg_restore \
  --data-only \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  --dbname="$NEON_DIRECT_URL" \
  linkwave-data.dump
```

Se a estratégia de identidade mudar colunas ou IDs, não usar restore direto. Exportar CSV para tabelas temporárias, executar uma transformação SQL explícita e só depois inserir nas tabelas finais.

## Fase 4 — Migrar autenticação

Este passo depende do estado real dos usuários:

- [ ] Exportar a relação `Supabase user UUID <-> email`.
- [ ] Exportar/auditar `Firebase UID <-> email`.
- [ ] Comparar duplicados, ausentes e UIDs não UUID.
- [ ] Garantir que cada usuário do Neon tenha exatamente uma identidade Firebase.
- [ ] Testar login, logout e recuperação de senha.

> [!danger] Senhas
> Copiar as tabelas públicas não migra credenciais. Não assuma que passwords do Supabase funcionarão no Firebase. Use um processo suportado de importação de hashes ou solicite reset de senha. Não manipule hashes manualmente.

Se o Firebase atual já é a autoridade de autenticação, validar o mapeamento por email/UID é suficiente. Se usuários ainda autenticam pelo Supabase, a migração de auth é um projeto separado do transporte do Postgres.

## Fase 5 — Validação em staging

- [ ] `npx prisma validate`
- [ ] `npx prisma generate`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Testar cadastro de usuário novo.
- [ ] Testar login/logout/reset de senha.
- [ ] Testar criação, edição, ordenação e exclusão de links.
- [ ] Testar profile, theme, avatar e banner.
- [ ] Testar página pública `/u/[username]`.
- [ ] Testar click tracking.
- [ ] Testar painel admin.
- [ ] Comparar contagens Supabase x Neon.
- [ ] Comparar amostras e checksums.

Consultas de validação no Neon:

```sql
select count(*) from users;
select count(*) from profiles;
select count(*) from links;
select count(*) from clicks;

select lower(email), count(*)
from users
group by lower(email)
having count(*) > 1;

select lower(username), count(*)
from users
group by lower(username)
having count(*) > 1;
```

Teste de integridade:

```sql
select count(*) from profiles p
left join users u on u.id = p.user_id
where u.id is null;

select count(*) from links l
left join users u on u.id = l.user_id
where u.id is null;

select count(*) from clicks c
left join links l on l.id = c.link_id
where l.id is null;
```

## Fase 6 — Cutover

Para um banco pequeno com manutenção curta:

1. ativar modo manutenção ou bloquear writes;
2. fazer export final;
3. limpar/recriar a branch Neon de produção se necessário;
4. importar dados finais;
5. rodar validações;
6. definir `DATABASE_URL` da aplicação para Neon;
7. executar migrations pendentes;
8. fazer deploy;
9. executar smoke tests;
10. reabrir writes.

Para downtime mínimo, usar replicação lógica ou dual-write temporário. Isso aumenta bastante a complexidade e só vale a pena se volume e tráfego justificarem.

## Fase 7 — Observação e rollback

Monitorar por pelo menos 24–72 horas:

- erros 5xx;
- falhas Prisma;
- latência e conexões;
- cadastros;
- writes de links e perfis;
- click tracking;
- divergência de contagens.

Rollback:

1. bloquear writes;
2. registrar dados escritos somente no Neon desde o cutover;
3. reverter a variável de conexão/deploy;
4. reabrir Supabase;
5. reconciliar writes antes de uma segunda tentativa.

Sem dual-write, rollback não é apenas trocar uma variável: dados novos do Neon precisam ser reconciliados.

## Fase 8 — Limpeza após estabilidade

Somente depois do período de observação:

- [ ] Remover o rate limit Supabase restante.
- [ ] Remover/recriar rotas de teste.
- [ ] Remover `src/lib/supabase/` e `src/lib/supabaseClient.ts` se não houver consumidores.
- [ ] Remover `@supabase/ssr` e `@supabase/supabase-js`.
- [ ] Atualizar README, overview, UI e E2E.
- [ ] Arquivar `supabase/` como histórico ou mover para `docs/legacy/`.
- [ ] Decidir separadamente se `web/` será migrado ou removido.
- [ ] Rotacionar e remover secrets Supabase do deploy.
- [ ] Manter backup final por um período definido.

## 5. Arquivos que exigem mudança

Prioridade alta:

- `prisma/schema.prisma`
- `prisma.config.ts`
- `src/lib/db/prisma.ts`
- `src/lib/actions/auth.ts`
- `src/lib/actions/admin.ts`
- `src/lib/security/rate-limit.ts`
- `.env.example`

Remover ou reescrever:

- `src/app/api/test/login/route.ts`
- `src/app/api/test/ci-login/route.ts`
- `src/lib/supabase/`
- `src/lib/supabaseClient.ts`

Atualizar após o cutover:

- `README.md`
- `LINKWAVE_TECHNICAL_OVERVIEW.md`
- `e2e/README.md`
- `e2e/dashboard.spec.ts`
- textos Supabase em `src/components/landing/`, login, register e admin

Fora do escopo inicial:

- `web/` — aplicação legada independente.
- `supabase/migrations/criar_usuários.sql` — Storage antigo; uploads ativos usam Cloudinary.

## 6. Critério de conclusão

A migração só está concluída quando:

- [ ] Neon é a única fonte dos dados relacionais da aplicação raiz.
- [ ] Todo usuário autenticado resolve para um `User` válido.
- [ ] Cadastro cria Firebase + `User` + `Profile` de forma consistente.
- [ ] Nenhuma operação normal usa Supabase.
- [ ] Constraints e índices necessários existem no Neon.
- [ ] Build, E2E e smoke tests passam.
- [ ] Contagens e integridade foram verificadas.
- [ ] Rollback foi documentado e testado.
- [ ] Secrets e documentação foram atualizados.

## 7. Referências oficiais

- [Neon — data migration guides](https://neon.com/docs/import/migrate-intro)
- [Neon — migration tooling](https://neon.com/migration)
- [Supabase — Database overview](https://supabase.com/docs/guides/database/overview)
- [Supabase CLI — database dump behavior](https://supabase.com/docs/reference/cli/supabase-orgs-list)
- [Supabase Auth — user data and auth schema](https://supabase.com/docs/guides/auth/managing-user-data)
- [Prisma — Neon database guide](https://www.prisma.io/docs/orm/overview/databases/neon)

