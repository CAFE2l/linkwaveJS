# LinkWave — Visão Técnica do Projeto

> Documentação técnica inicial do sistema LinkWave, uma plataforma SaaS de
> gerenciamento de links pessoais com perfil público, dashboard de controle,
> temas customizáveis e painel administrativo.

---

## 1. Arquitetura do Sistema

### 1.1 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 + CSS Modules via `globals.css` |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (SSR com cookies) |
| ORM/Cliente | `@supabase/ssr` + `@supabase/supabase-js` |
| Formulários | react-hook-form + Zod |
| Animações | Framer Motion, CSS Keyframes |
| Ícones | Lucide React + PNGs estáticos |
| Gráficos | Recharts (painel admin) |
| Drag-and-drop | @dnd-kit |
| Testes | Playwright (e2e) |

### 1.2 Estrutura de Pastas

```
linkwave/
├── middleware.ts              # Middleware Next.js (sessão + segurança)
├── next.config.ts             # Configuração do Next.js
├── package.json               # Manifesto do projeto
├── postcss.config.mjs         # Config PostCSS (Tailwind v4)
│
├── src/
│   ├── app/                   # App Router — páginas e API routes
│   │   ├── page.tsx           # Landing page (home)
│   │   ├── layout.tsx         # Layout raiz (fonts, Firebase, metadata)
│   │   ├── globals.css        # CSS global + classes glass
│   │   ├── login/             # Página de login
│   │   ├── register/          # Página de cadastro
│   │   ├── reset-password/    # Página de redefinição de senha
│   │   ├── dashboard/         # Dashboard principal + customize
│   │   ├── profile/           # Editor de perfil
│   │   ├── theme/             # Customizador de tema
│   │   ├── admin/             # Painel administrativo
│   │   ├── u/[username]/      # Perfil público (rota dinâmica)
│   │   ├── auth/callback/     # Callback OAuth
│   │   ├── api/               # API routes (click, links, health, test)
│   │   └── terms/             # Página de termos de uso
│   │
│   ├── components/            # Componentes React
│   │   ├── landing/           # Seções da landing page
│   │   ├── dashboard/         # Componentes do dashboard
│   │   ├── customize/         # Componentes do painel de customização
│   │   ├── profile/           # Editor de perfil
│   │   ├── theme/             # Customizador de tema
│   │   ├── auth/              # Componentes de autenticação
│   │   ├── public-profile/    # Componentes do perfil público
│   │   ├── shared/            # Componentes compartilhados
│   │   ├── admin/             # Componentes do admin
│   │   ├── ui/                # Primitivas de UI base
│   │   └── layout/            # Camadas de layout (z-index)
│   │
│   ├── lib/
│   │   ├── actions/           # Server Actions (auth, dashboard, admin, etc.)
│   │   ├── supabase/          # Clientes Supabase (server, client, admin, middleware)
│   │   ├── security/          # Rate-limit e sanitização
│   │   ├── utils/             # Utilitários (cn, url)
│   │   └── validations/       # Schemas Zod
│   │
│   ├── hooks/                 # React hooks (useThemeContext)
│   └── types/database.ts     # Tipos TypeScript do banco
│
├── supabase/
│   ├── schema.sql             # Schema completo (tabelas, índices, RLS, triggers)
│   ├── seed.sql               # Dados de seed (5 usuários, links, cliques)
│   └── migrations/            # Migrações incrementais
│
├── public/                    # Assets estáticos (brand, icons)
├── e2e/                       # Testes Playwright
└── imgs/                      # Imagens de ícones
```

### 1.3 Responsabilidade das Principais Pastas

| Pasta | Responsabilidade |
|---|---|
| `src/app/` | Rotas da aplicação (páginas + API endpoints) |
| `src/components/` | Componentes React organizados por domínio |
| `src/lib/actions/` | Server Actions (lógica de negócio executada no servidor) |
| `src/lib/supabase/` | Configuração e clientes do Supabase |
| `src/lib/validations/` | Schemas de validação Zod |
| `src/types/` | Tipagens TypeScript do banco de dados |
| `supabase/` | Schema SQL, seeds e migrações do banco |
| `public/` | Assets estáticos (imagens, favicon) |

---

## 2. Fluxo Front-end → API → Banco

### 2.1 Cadastro de Usuário (Registro)

```
RegisterForm (cliente)
  → registerUserAction() [server action]
    → rate-limit check (registration_rate_limits)
    → verifica unicidade de username/email (admin client)
    → admin.auth.admin.createUser() no Supabase Auth
    → trigger on_auth_user_created cria registros em:
        - public.users
        - public.profiles
    → signInWithPassword() (login automático pós-cadastro)
    → redirect /dashboard
```

### 2.2 Login

```
LoginForm (cliente)
  → loginAction() [server action]
    → validação Zod (email, senha)
    → supabase.auth.signInWithPassword()
    → redirect /dashboard
```

Alternativa: OAuth Google via `GoogleAuthButton`.

### 2.3 Criação de Perfil

```
ProfileEditor / ProfileForm (cliente)
  → updateProfileAction() [server action]
    → validação Zod
    → UPDATE public.users (name, avatar_url)
    → UPDATE public.profiles (bio, username)
    → revalidatePath()
```

Upload de avatar/banner:
```
AvatarUpload / BannerUpload
  → uploadAvatarAction() / uploadBannerAction() [server actions]
    → upload para Supabase Storage ("user-content" bucket)
    → retorna URL pública
    → salva URL no banco (users.avatar_url / users.banner_url)
```

### 2.4 CRUD de Links

```
LinkForm (dashboard) ou NewLinkForm (customize)
  → POST /api/links (API route autenticada)
    → valida os campos (title, url, icon)
    → INSERT INTO public.links
    → Revalida rota /dashboard

LinksManager / LinkList
  → drag-and-drop reordenação via @dnd-kit
    → reorderLinksAction() [server action]
      → UPDATE public.links SET order_position

Edição:
  → PUT /api/links (API route autenticada)
    → UPDATE public.links SET title, url, icon

Exclusão:
  → DELETE /api/links (API route autenticada)
    → DELETE FROM public.links WHERE id = ?
```

### 2.5 Visualização do Perfil Público

```
GET /u/[username] (server component)
  → createClient() → consulta:
    - public.users WHERE username = ? AND active = true
    - public.profiles WHERE user_id = ?
    - public.links WHERE user_id = ? ORDER BY order_position
  → Renderiza perfil com:
    - ThemeProviderShell (injetando CSS vars do tema)
    - BackgroundLayer (efeito de fundo)
    - StarCanvas (estrelas animadas)
    - Banner + avatar + bio
    - Lista de links (AnimatedLinks + PublicLinkButton)
```

Cada clique em link no perfil público:
```
  → POST /api/click (público)
    → INSERT INTO public.clicks (link_id, user_id, ip_address, country, city)
    → O IP/country/city vêm de cabeçalhos HTTP (x-forwarded-for, x-vercel-ip-country, etc.)
```

### 2.6 Coleta de Dados Estatísticos

- **Landing page**: `getLandingStats()` → conta usuários ativos, total de cliques, satisfação (percentual de usuários com ao menos 1 clique)
- **Admin**: `getAnalyticsOverview()` → dados completos (crescimento, atividade, top links, países, horários, engajamento)

---

## 3. Modelo do Banco de Dados

### 3.1 Tabelas

| Tabela | Finalidade |
|---|---|
| `public.users` | Espelho dos usuários do Auth, com dados públicos adicionais |
| `public.profiles` | Dados ricos de perfil (bio, tema, cores customizadas) |
| `public.links` | Links cadastrados pelos usuários |
| `public.clicks` | Registro de cliques nos links |
| `public.registration_rate_limits` | Controle de taxa de cadastro por IP |

### 3.2 Relacionamentos

```
auth.users (Supabase, gerenciado pelo Auth)
    │ (on delete cascade)
    ▼
public.users  ──── has many ──── public.links
    │                              │
    │ (1:1, unique)                │ (on delete cascade)
    ▼                              ▼
public.profiles               public.clicks
                                  │
                                  └── belongs to public.links (link_id)
                                  └── belongs to public.users (user_id)
```

### 3.3 Políticas RLS

| Tabela | Operação | Regra |
|---|---|---|
| `users` | SELECT | `active = true` (público) OU `auth.uid() = id` (próprio) |
| `users` | INSERT | `auth.uid() = id` |
| `users` | UPDATE | `auth.uid() = id` |
| `profiles` | SELECT | `active = true` OU `auth.uid() = user_id` |
| `profiles` | ALL | `auth.uid() = user_id` |
| `links` | SELECT | `true` (qualquer um pode ver) |
| `links` | ALL | `auth.uid() = user_id` |
| `clicks` | SELECT | `auth.uid() = user_id` (apenas dono) |
| `clicks` | INSERT | `true` (qualquer um pode registrar clique, com checagem de existência do link) |
| `registration_rate_limits` | ALL | Apenas `service_role` |

Além disso, o bucket `user-content` no Storage possui políticas para leitura pública,
upload autenticado e gerenciamento apenas pelo dono do arquivo.

### 3.4 Índices

- `users_active_idx`, `users_username_idx`, `users_username_lower_idx` (unique), `users_email_lower_idx` (unique), `users_role_idx`
- `profiles_active_idx`, `profiles_username_lower_idx` (unique), `profiles_email_lower_idx` (unique), `profiles_user_id_idx`
- `links_user_order_idx` (user_id, order_position)
- `clicks_user_created_idx` (user_id, created_at DESC), `clicks_link_created_idx` (link_id, created_at DESC)
- `registration_rate_limits_ip_created_idx` (ip_key, created_at DESC)

### 3.5 Trigger: `on_auth_user_created`

Quando um novo usuário é criado no `auth.users` (via cadastro ou OAuth), o trigger
automaticamente:
1. Cria registro em `public.users` com ID = `auth.users.id`, email, username único gerado
2. Cria registro em `public.profiles` vinculado ao `user_id`

---

## 4. Principais Tabelas — Detalhamento

### 4.1 `public.users`

**Finalidade**: Espelha os usuários do Supabase Auth com dados públicos e de controle.
É a tabela de referência para relacionamentos com links e cliques.

**Campos**:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | Referencia `auth.users(id) ON DELETE CASCADE` |
| `email` | `text` | Email em lowercase, único (índice unique) |
| `username` | `text` | Apelido público, único (índice unique lowercase) |
| `name` | `text` | Nome de exibição |
| `avatar_url` | `text?` | URL do avatar no Storage |
| `banner_url` | `text?` | URL do banner no Storage |
| `theme_json` | `jsonb` | Configuração completa do tema (`UserThemeConfig`) |
| `role` | `text` | `'user'` ou `'admin'` |
| `active` | `boolean` | Se a conta está ativa (default `true`) |
| `created_at` | `timestamptz` | Data de criação |

**Relações**: 1:1 com `profiles(user_id)`, 1:N com `links(user_id)`, 1:N com `clicks(user_id)`

**Exemplo de uso**: Ao acessar `/u/joao`, o sistema busca `SELECT * FROM users WHERE username = 'joao' AND active = true`.

### 4.2 `public.profiles`

**Finalidade**: Armazena dados estendidos de perfil, como biografia e preferências de tema.

**Campos**:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | Gerado automaticamente |
| `user_id` | `uuid` | Referencia `users(id) ON DELETE CASCADE` (unique) |
| `name` | `text` | Nome de exibição |
| `username` | `text` | Apelido (único) |
| `email` | `text` | Email |
| `avatar_url` | `text?` | URL do avatar |
| `active` | `boolean` | Se o perfil está ativo |
| `bio` | `text?` | Biografia (máx. 180 caracteres) |
| `theme` | `text` | Tema: `'wave'`, `'midnight'`, `'minimal'` ou `'aurora'` |
| `custom_colors` | `jsonb` | Cores customizadas (legado, não usado ativamente) |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização (auto-trigger) |

**Relações**: Pertence a `users(user_id)`

**Exemplo de uso**: No editor de perfil, o bio é lido de `profiles.bio` pela chave `user_id`.

### 4.3 `public.links`

**Finalidade**: Armazena os links criados pelos usuários para exibição no perfil público.

**Campos**:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | Gerado automaticamente |
| `user_id` | `uuid` | Referencia `users(id) ON DELETE CASCADE` |
| `title` | `text` | Título do link (2–60 caracteres) |
| `url` | `text` | URL (deve começar com `http://` ou `https://`) |
| `icon` | `text?` | Nome do ícone (referencia PNG em `/imgs/icons/links/`) |
| `icone` | `text?` | Campo alternativo de ícone (adicionado em migration) |
| `icon_blob` | `text?` | Blob base64 do ícone customizado |
| `is_custom_icon` | `boolean` | Se o ícone é customizado (vs. ícone padrão) |
| `order_position` | `integer` | Posição de ordenação (drag-and-drop) |
| `created_at` | `timestamptz` | Data de criação |

**Relações**: Pertence a `users(user_id)`. 1:N com `clicks(link_id)`.

**Exemplo de uso**: No dashboard, o usuário cria um link com título "Meu Instagram" e URL
`https://instagram.com/fulano`. O link aparece no perfil público com o ícone do Instagram.

### 4.4 `public.clicks`

**Finalidade**: Registra cada clique em um link do perfil público para análise estatística.

**Campos**:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | Gerado automaticamente |
| `link_id` | `uuid` | Referencia `links(id) ON DELETE CASCADE` |
| `user_id` | `uuid` | Referencia `users(id) ON DELETE CASCADE` |
| `ip_address` | `inet?` | Endereço IP (pode ser nulo) |
| `country` | `text?` | País (inferido do IP) |
| `city` | `text?` | Cidade (inferido do IP) |
| `created_at` | `timestamptz` | Data do clique |

**Relações**: Pertence a `links(link_id)` e `users(user_id)`.

**Exemplo de uso**: Quando alguém clica em "Meu Instagram" no perfil público, o sistema
registra `INSERT INTO clicks (link_id, user_id, ip_address, country, city)`.

### 4.5 `public.registration_rate_limits`

**Finalidade**: Controla a taxa de cadastro por IP para prevenir abuso.

**Campos**:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `uuid` PK | Gerado automaticamente |
| `ip_key` | `text` | Hash SHA-256 do IP do solicitante |
| `created_at` | `timestamptz` | Data da tentativa de cadastro |

**Exemplo de uso**: Antes de criar um usuário, o sistema verifica quantos registros
existem para aquele `ip_key` nos últimos 15 minutos. Se excedeu o limite, bloqueia.

---

## 5. APIs, Server Actions e Rotas do Sistema

### 5.1 API Routes

| Rota | Método | Autenticação | Entrada | Saída |
|---|---|---|---|---|
| `/api/health` | GET | Pública | — | `{ ok: true, service: "linkwave" }` |
| `/api/links` | POST | Obrigatória | `{ title, url, icon?, is_custom_icon?, icon_blob? }` | Objeto do link criado |
| `/api/links` | PUT | Obrigatória | `{ id, title?, url?, icon? }` | Objeto do link atualizado |
| `/api/links` | DELETE | Obrigatória | `{ id }` | `{ ok: true, message }` |
| `/api/click` | POST | Pública | `{ linkId, userId }` | Registra clique (sem retorno específico) |
| `/api/test/login` | POST | Restrita (dev) | `{ email, password }` | Seta cookies de sessão |
| `/api/test/ci-login` | POST | Restrita (dev) | `{ email, password }` | Cria usuário + seta cookies |
| `/auth/callback` | GET | Pública | Query: `code`, `next` | Redireciona pós-OAuth |

### 5.2 Server Actions

| Arquivo | Ação | Descrição |
|---|---|---|
| `auth.ts` | `loginAction()` | Login com email/senha + validação Zod |
| `auth.ts` | `registerUserAction()` | Cadastro com validação, rate-limit, criação de usuário |
| `auth.ts` | `checkUsernameAvailabilityAction()` | Verifica se username está disponível |
| `auth.ts` | `resetPasswordAction()` | Envia email de redefinição de senha |
| `auth.ts` | `logoutAction()` | Faz logout e redireciona para `/` |
| `dashboard.ts` | `upsertLinkAction()` | Cria ou atualiza link |
| `dashboard.ts` | `deleteLinkAction()` | Exclui link |
| `dashboard.ts` | `reorderLinksAction()` | Reordena links (array de IDs) |
| `dashboard.ts` | `uploadAvatarAction()` | Faz upload de avatar para Storage |
| `dashboard.ts` | `uploadBannerAction()` | Faz upload de banner para Storage |
| `profile.ts` | `updateProfileAction()` | Atualiza dados do perfil (nome, bio, avatar) |
| `theme.ts` | `updateThemeAction()` | Salva configuração do tema (`theme_json`) |
| `clicks.ts` | `recordClickAction()` | Server action para registrar clique |
| `stats.ts` | `getLandingStats()` | Retorna estatísticas da landing page |
| `icons.ts` | `listIconsAction()` | Lista ícones disponíveis no diretório |
| `admin.ts` | `getAdminUsers()`, `updateUserRoleAction()`, `toggleUserActiveAction()`, `deleteLinkAdminAction()`, `getAdminLinks()`, `resetUserThemeAction()`, `getAdminThemes()` | Operações administrativas (requer role `admin`) |
| `analytics.ts` | `getAnalyticsOverview()` | Dados analíticos completos do admin |

### 5.3 Rotas da Aplicação

| Rota | Tipo | Protegida | Descrição |
|---|---|---|---|
| `/` | Página | Não | Landing page |
| `/login` | Página | Não (redireciona se logado) | Login |
| `/register` | Página | Não (redireciona se logado) | Cadastro |
| `/reset-password` | Página | Não | Redefinição de senha |
| `/dashboard` | Página | Sim | Dashboard principal |
| `/dashboard/customize` | Página | Sim | Painel de customização |
| `/profile` | Página | Sim | Editor de perfil |
| `/theme` | Página | Sim | Customizador de tema |
| `/admin/*` | Páginas | Sim (admin) | Painel administrativo |
| `/u/[username]` | Página | Não | Perfil público |
| `/terms` | Página | Não | Termos de uso |
| `/onboarding` | Página | Sim | Redirecionamento pós-login |

As rotas protegidas são definidas em `src/lib/supabase/middleware.ts`:
```
protectedRoutes = ["/dashboard", "/profile", "/theme", "/admin", "/onboarding", "/settings"]
authRoutes = ["/login", "/register"]
```

---

## 6. Módulo Analítico

### 6.1 O que existe atualmente

#### Landing Page
A server action `getLandingStats()` em `src/lib/actions/stats.ts` calcula:

| Métrica | Cálculo |
|---|---|
| `totalUsers` | `COUNT(*) FROM users WHERE active = true` |
| `totalClicks` | `COUNT(*) FROM clicks` |
| `satisfaction` | Percentual de usuários ativos que têm pelo menos 1 clique registrado |

#### Painel Admin
A server action `getAnalyticsOverview()` em `src/lib/actions/analytics.ts` calcula:

| Métrica | Descrição |
|---|---|
| `totalUsers` | Total de usuários cadastrados |
| `totalUsersDelta` | Variação percentual em relação aos 30 dias anteriores |
| `totalLinks` | Total de links criados |
| `totalClicks` | Total de cliques registrados |
| `totalClicksDelta` | Variação percentual em relação aos 30 dias anteriores |
| `userGrowth` | Array diário de novos usuários nos últimos 30 dias |
| `clickActivity` | Array diário de cliques nos últimos 30 dias |
| `topLinks` | Top 10 links mais clicados (com username do dono) |
| `countryDistribution` | Distribuição geográfica dos cliques |
| `hourlyActivity` | Distribuição horária dos cliques (0–23h) |
| `engagement` | Distribuição de quantos links por usuário |

#### Dashboard do Usuário
O dashboard do usuário (`StatsCards`) exibe:
- Total de links do usuário
- Total de cliques nos links do usuário
- Link mais acessado

### 6.2 O que NÃO existe

- **Visualizações de perfil**: Não há registro de quando alguém acessa o perfil público (`/u/[username]`).
  Não existe tabela `page_views` ou similar.
- **Histórico para o usuário comum**: O dashboard do usuário mostra apenas totais, sem gráficos
  de evolução temporal, distribuição geográfica ou por link individual ao longo do tempo.
- **Analytics em tempo real**: Os dados só são atualizados mediante requisição ao banco.

### 6.3 Sugestão de Estrutura para Analytics

Para implementar um módulo analítico completo, sugere-se:

```sql
-- Visualizações de perfil
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  ip_address inet,
  country text,
  city text,
  referer text,
  created_at timestamptz not null default now()
);

create index page_views_user_created_idx on public.page_views(user_id, created_at desc);
```

**Métricas sugeridas para o dashboard do usuário:**

| Métrica | Origem |
|---|---|
| Total de links | `COUNT(*) FROM links WHERE user_id = ?` |
| Total de cliques | `COUNT(*) FROM clicks WHERE user_id = ?` |
| Cliques por link | `SELECT link_id, COUNT(*) FROM clicks WHERE user_id = ? GROUP BY link_id` |
| Top links mais acessados | `ORDER BY COUNT(*) DESC` nos cliques agrupados |
| Evolução diária de cliques | `SELECT DATE(created_at), COUNT(*) ... GROUP BY DATE` |
| Crescimento de visualizações | `SELECT DATE(created_at), COUNT(*) FROM page_views ... GROUP BY DATE` |
| Dispositivos/navegadores | Via headers User-Agent (requer campo extra) |
| Países de origem | Já disponível em `clicks.country` |

---

## 7. Segurança

### 7.1 Autenticação

O LinkWave utiliza **Supabase Auth** com duas modalidades:

1. **Email/senha**: Login e cadastro via `supabase.auth.signInWithPassword()` e
   `admin.auth.admin.createUser()` + `signInWithPassword()`.
2. **OAuth Google**: Botão "Google" que dispara `supabase.auth.signInWithOAuth({ provider: "google" })`
   e trata o retorno em `/auth/callback`.

### 7.2 Sessão (SSR com Cookies)

O fluxo de sessão usa `@supabase/ssr`:

1. **Middleware** (`middleware.ts` → `src/lib/supabase/middleware.ts`):
   - Cria um `createServerClient` no middleware
   - Troca/refresca cookies de sessão a cada requisição
   - Redireciona não-autenticados de rotas protegidas para `/login`
   - Redireciona autenticados de rotas de auth (`/login`, `/register`) para `/dashboard`
   - Aplica headers de segurança (`X-Frame-Options`, `X-Content-Type-Options`, etc.)

2. **Server Components**: Usam `createClient()` de `src/lib/supabase/server.ts` que lê cookies
   via `next/headers`.

3. **Client Components**: Usam `createClient()` de `src/lib/supabase/client.ts` que usa
   `createBrowserClient` do `@supabase/ssr`.

4. **Admin (service_role)**: Usa `createAdminClient()` de `src/lib/supabase/admin.ts` que
   cria um cliente com a chave `service_role`, capaz de bypassar RLS.

### 7.3 RLS (Row-Level Security)

As políticas RLS estão detalhadas na seção 3.3. Em resumo:

- **Usuários só veem/alteram seus próprios dados** (RLS com `auth.uid() = user_id`)
- **Perfis públicos são legíveis por qualquer um** (mas apenas se `active = true`)
- **Cliques podem ser inseridos por qualquer um** (necessário para tracking público),
  mas apenas o dono pode ler seus próprios cliques
- **Links são públicos para leitura** (qualquer visitante do perfil público pode ver),
  mas apenas o dono pode gerenciar (criar/editar/excluir)
- **Rate-limit de cadastro** é gerenciado exclusivamente via `service_role`

### 7.4 Validação

- **Server-side**: Todas as Server Actions usam schemas **Zod** para validar entrada
- **Client-side**: `react-hook-form` com `@hookform/resolvers/zod`
- **Sanitização**: `src/lib/security/sanitize.ts` remove caracteres especiais de inputs
- **Rate-limit**: `src/lib/security/rate-limit.ts` limita cadastros por IP (hash SHA-256)

### 7.5 Riscos Identificados

| Risco | Descrição | Severidade |
|---|---|---|
| Tracking público sem proteção contra abuso | `POST /api/click` aceita qualquer requisição sem autenticação. Um atacante pode gerar cliques falsos em massa. | Média |
| Upload de arquivos sem validação de tipo no servidor | A validação de tipo de arquivo (imagem) é feita apenas no front-end. Um atacante pode enviar arquivos arbitrários via ferramentas como cURL. | Média |
| Chave Firebase exposta no HTML | A chave da API Firebase está hardcoded no `layout.tsx` e visível no source da página. | Baixa (Firebase tem restrições de domínio) |
| Toast com chaves não-criptografadas | As mensagens de toast passam pelo cliente sem sanitização | Baixa |

---

## 8. Melhorias Recomendadas

### 8.1 Organização e Arquitetura

| ID | Sugestão | Justificativa |
|---|---|---|
| 1 | Unificar `FullDashboard` e `DashboardShell` em um único componente de layout | Existem dois sistemas de dashboard paralelos com código duplicado (header, navegação). Consolidar reduz manutenção. |
| 2 | Remover arquivos mortos (`customize/FullDashboard.tsx`, `customize/PreviewCard.tsx`, etc.) | Vários componentes não são mais importados após refators. Acumulam dívida técnica. |
| 3 | Mover `src/lib/supabaseClient.ts` (legado) para dentro de `src/lib/supabase/` | Consistência na organização dos clientes Supabase. |
| 4 | Padronizar retorno de Server Actions | Algumas retornam `{ ok, message }`, outras `ActionState`, outras dados diretos. Criar um tipo `ActionResult<T>` unificado. |

### 8.2 Validação e Tratamento de Erros

| ID | Sugestão |
|---|---|
| 5 | Adicionar validação de tipo MIME no servidor para uploads (avatar/banner) |
| 6 | Criar um wrapper de erro global para Server Actions com `try/catch` padronizado |
| 7 | Usar `safeParse` do Zod consistentemente em todas as ações |
| 8 | Adicionar validação de URL no backend além do front-end (atualmente o front-end valida, mas API routes poderiam rejeitar URLs inválidas) |

### 8.3 Analytics

| ID | Sugestão |
|---|---|
| 9 | Criar tabela `page_views` para rastrear visualizações de perfil público |
| 10 | Implementar dashboard de analytics para o usuário comum (não apenas admin) com gráficos e evolução temporal |
| 11 | Adicionar coluna `user_agent` em `clicks` para análise de dispositivos |
| 12 | Implementar armazenamento de referrer (de onde o visitante veio) nos cliques |
| 13 | Adicionar proteção anti-bot no endpoint `/api/click` (rate-limit por IP, CAPTCHA leve, verificação de `sec-fetch-site` header) |

### 8.4 Performance

| ID | Sugestão |
|---|---|
| 14 | Implementar ISR (Incremental Static Regeneration) para perfis públicos com tráfego alto |
| 15 | Adicionar cache com Redis ou Vercel KV para consultas frequentes (contagens na landing page) |
| 16 | Otimizar imagens de ícones (Sprite sheet ou conversão para WebP com `next/image`) |
| 17 | Implementar paginação na lista de links do admin (atualmente carrega sem limite) |

### 8.5 Segurança

| ID | Sugestão |
|---|---|
| 18 | Adicionar rate-limit no endpoint `/api/click` (ex: 10 cliques/min por IP) |
| 19 | Validar tipo MIME de arquivos no servidor (usando `file-type` ou similar) |
| 20 | Mover chave Firebase para variável de ambiente e carregar apenas se configurada |
| 21 | Adicionar validação CSRF em mutações via API routes |
| 22 | Sanitizar HTML nas mensagens de toast e outros pontos de saída |

### 8.6 Experiência do Desenvolvedor

| ID | Sugestão |
|---|---|
| 23 | Adicionar testes unitários para Server Actions (Vitest + Supabase local) |
| 24 | Adicionar script de CI (GitHub Actions) para lint + build + testes |
| 25 | Criar tipagem compartilhada entre front-end e testes (`@/types`) |
| 26 | Documentar variáveis de ambiente necessárias no `README.md` |

---

## Resumo Geral

O LinkWave é uma aplicação web full-stack construída com Next.js 15 (App Router),
TypeScript e Supabase (PostgreSQL + Auth) que permite a usuários criar uma página
de perfil público contendo uma lista de links personalizáveis, similar a serviços
como Linktree. O sistema conta com autenticação por email/senha e OAuth Google,
dashboard completo com CRUD de links via arrastar-e-soltar (drag-and-drop),
upload de avatar/banner, customização visual profunda por meio de temas com
atributos como tipo de fundo, opacidade, desfoque, cores, efeitos e estilos de vidro
(glassmorphism), além de um perfil público dinâmico que exibe os links com
animações e efeitos visuais configuráveis. Um painel administrativo separado
fornece análise de dados com gráficos de crescimento, atividade de cliques,
distribuição geográfica e engajamento. A segurança é baseada em Supabase Auth
com sessão SSR gerenciada por middleware, políticas RLS no PostgreSQL e validação
Zod em todas as ações do servidor.
