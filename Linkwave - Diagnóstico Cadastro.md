# Diagnóstico — Cadastro (email/senha e Google) não funciona

## Problema

O formulário de cadastro em `/register` falha silenciosamente tanto com **email/senha** quanto com **Continuar com Google**. Nenhum erro visível é mostrado ao usuário.

---

## Causa raiz

### 1. `.env.local` com credenciais placeholder

O arquivo `.env.local` contém:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key              ← NUNCA FOI TROCADO
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key           ← NUNCA FOI TROCADO
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   ← variável não-usada no código
```

Os valores `your-anon-key` e `your-service-role-key` são **placeholders** copiados diretamente do `.env.example` sem nunca terem sido substituídos pelas chaves reais do Supabase.

### 2. Schema do banco não foi executado

O endpoint REST do Supabase retorna:

```
Could not find the table 'public.users' in the schema cache
```

Isso significa que o SQL em `supabase/schema.sql` **nunca foi executado** no projeto. As tabelas `users`, `profiles`, `links`, `clicks`, `registration_rate_limits` e os triggers não existem.

---

## Fluxo de falha (email/senha)

1. Usuário preenche o formulário e clica em "Criar minha conta"
2. Server action `registerUserAction()` é chamado
3. `checkRegistrationRateLimit(ip)` → `createAdminClient()` tenta conectar com `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key` → Supabase rejeita → retorna `"Não foi possível validar sua tentativa agora."`
4. Mensagem aparece no formulário
5. Mesmo se passasse, `admin.auth.admin.createUser()` falharia pela mesma razão

## Fluxo de falha (Google OAuth)

1. Usuário clica "Continuar com Google"
2. `supabase.auth.signInWithOAuth({ provider: "google" })` tenta criar client com `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`
3. Supabase rejeita por anon key inválida → `error` retorna
4. `setLoading(false)` — botão só volta ao estado inicial, sem feedback
5. Usuário não vê erro nenhum

---

## O que fazer (passo a passo)

### 1. Pegar as chaves reais no Supabase Dashboard

- Acessar https://supabase.com
- Entrar no projeto (URL: `ukyeixrgocyqqqqxmcej.supabase.co`)
- Ir em **Project Settings → API**
- Copiar:
  - **Project URL** → já está correto em `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** → valor para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role secret** → valor para `SUPABASE_SERVICE_ROLE_KEY`

### 2. Atualizar `.env.local`

Editar `Linkwave/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ukyeixrgocyqqqqxmcej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<COLAR ANON KEY REAL AQUI>
SUPABASE_SERVICE_ROLE_KEY=<COLAR SERVICE ROLE KEY REAL AQUI>
```

Remover a linha `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (não é usada no código).

### 3. Executar o schema SQL no Supabase

- No Supabase Dashboard, ir em **SQL Editor**
- Abrir `Linkwave/supabase/schema.sql`
- Copiar todo o conteúdo e colar no SQL Editor
- Executar (botão "Run" ou Cmd+Enter)

Isso criará:

| Tabela | Descrição |
|---|---|
| `public.users` | Mirror público de `auth.users` |
| `public.profiles` | Perfil com bio, tema, cores |
| `public.links` | Links do usuário |
| `public.clicks` | Cliques nos links |
| `public.registration_rate_limits` | Rate limit p/ cadastro |

Além de índices, RLS policies, triggers (cria automaticamente `users` + `profiles` quando um novo usuário é criado no `auth.users`) e a função `unique_username()`.

### 4. Verificar se o Google OAuth está configurado

- No Supabase Dashboard, ir em **Authentication → Providers**
- Verificar se **Google** está habilitado
- Se não estiver, ativar e configurar:
  - **Client ID** e **Client Secret** → pegar no Google Cloud Console (https://console.cloud.google.com)
  - **Redirect URL** → adicionar `https://ukyeixrgocyqqqqxmcej.supabase.co/auth/v1/callback`

### 5. Limpar cache e reiniciar

```bash
rm -rf .next
npm run dev
```

---

## Checklist final

- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` com valor real (não placeholder)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` com valor real (não placeholder)
- [ ] Schema SQL executado no Supabase SQL Editor
- [ ] Google OAuth configurado em Authentication → Providers
- [ ] Dev server reiniciado
- [ ] Testar: cadastro email/senha
- [ ] Testar: cadastro com Google

---

## Notas técnicas

- A server action `registerUserAction()` em `src/lib/actions/auth.ts` usa `createAdminClient()` (que precisa do `SUPABASE_SERVICE_ROLE_KEY`) para criar usuário via `admin.auth.admin.createUser()`. Depois faz login com `createClient()` usando anon key.
- O callback do Google OAuth em `src/app/auth/callback/route.ts` também insere em `public.users` e `public.profiles` manualmente, mas o trigger `handle_new_auth_user()` já faz isso automaticamente se as tabelas existirem.
- O rate limit de registro consulta `public.registration_rate_limits` — se a tabela não existe, a query falha e bloqueia o cadastro.
