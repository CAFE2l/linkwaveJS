# LinkWave 🌊

**LinkWave** is a modern link-in-bio platform with a beautiful frutiger aero design, deep theme customization, and a full analytics dashboard. Built with Next.js 15, Supabase, and TypeScript.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Front-end** | Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Recharts |
| **Back-end** | Next.js Server Actions, API Routes (Route Handlers), Supabase SSR |
| **Banco de dados** | PostgreSQL (via Supabase), Row Level Security, 5 tabelas, 13 índices |
| **Autenticação** | Supabase Auth (JWT), OAuth (Google/GitHub), sessions via cookies |
| **Storage** | Supabase Storage (avatars, banners) |
| **Ícones** | Lucide React + 137 PNG icons em `public/imgs/icons/links/` |
| **Deploy** | Vercel |

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/linkwave.git
cd linkwave

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Inicie o banco de dados (aplicar schema + seed)
# No painel do Supabase, execute o SQL em supabase/schema.sql
# Opcional: supabase/seed.sql para dados de demonstração

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=       # URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Chave anônima (pública)
SUPABASE_SERVICE_ROLE_KEY=      # Chave de serviço (admin) — nunca exposta no cliente
ENABLE_TEST_LOGIN=              # Opcional: habilita endpoints de login de teste
```

---

## Estrutura do Projeto

```
src/
├── app/                        # Next.js App Router (rotas, API, layouts)
│   ├── u/[username]/           # Página pública de perfil
│   ├── dashboard/              # Dashboard do usuário
│   │   └── customize/          # Página de customização de tema
│   ├── admin/                  # Painel administrativo
│   │   ├── overview/           # Dashboard de analytics
│   │   ├── users/              # Gerenciamento de usuários
│   │   ├── links/              # Gerenciamento de links
│   │   └── themes/             # Temas dos usuários
│   ├── login/                  # Login
│   ├── register/               # Cadastro
│   └── api/                    # API routes
│       ├── links/              # CRUD de links
│       └── click/              # Registro de cliques
├── components/
│   ├── customize/              # Componentes do dashboard (ProfileCard, LinkList, PreviewCard, etc.)
│   ├── landing/                # Landing page (navbar, hero, footer, CTA)
│   ├── admin/                  # Componentes administrativos + 7 charts
│   ├── dashboard/              # Dashboard shell, links manager
│   ├── public-profile/         # Componentes de perfil público (CosmicAvatar, StarCanvas, etc.)
│   ├── shared/                 # Componentes compartilhados (ThemeProviderShell, PublicLinkButton)
│   ├── ui/                     # Componentes base (Card, Button, Input, Avatar)
│   └── theme/                  # Customizador de tema legado
├── lib/
│   ├── actions/                # Server Actions (auth, dashboard, analytics, admin, etc.)
│   ├── supabase/               # Clientes Supabase (server, client, admin, middleware)
│   ├── validations/            # Schemas Zod
│   └── utils/                  # Utilitários (URL, cn)
├── types/                      # Tipos TypeScript (database, UserThemeConfig)
└── hooks/                      # React hooks (useThemeContext)
supabase/
├── schema.sql                  # Esquema completo do banco
├── seed.sql                    # Dados de demonstração
└── migrations/                 # Migrações incrementais
```

---

## Funcionalidades

### Para Usuários
- **Criação de links** com ícones personalizados (137 disponíveis)
- **Customização completa de tema**: gradientes, galaxy, estilos de card, efeitos, fontes, LED colors
- **Preview ao vivo** das alterações
- **Upload de avatar e banner**
- **Página pública** (`/u/username`) com tema aplicado em tempo real
- **Estatísticas básicas**: cliques totais no dashboard

### Para Administradores
- **Dashboard analítico completo** com 7 gráficos:
  - Cartões de métricas (usuários, links, cliques + delta)
  - Crescimento de usuários (gráfico de área, 30 dias)
  - Atividade de cliques (gráfico de barras, 30 dias)
  - Top links ranqueados (gráfico de barras horizontal)
  - Distribuição por país (barras com bandeiras)
  - Atividade por hora do dia (gráfico de área)
  - Engajamento (distribuição de links por usuário)
- **Gerenciamento de usuários**, links e temas
- Dados **100% reais** do banco (nenhum valor hardcoded)

---

## Ciência de Dados

### Métricas Calculadas

| Métrica | Tipo | Cálculo |
|---------|------|---------|
| Total de usuários | Contagem | `SELECT count(*) FROM users` |
| Total de links | Contagem | `SELECT count(*) FROM links` |
| Total de cliques | Contagem | `SELECT count(*) FROM clicks` |
| Delta de cliques | Porcentagem | `((cliques_30d - cliques_30d_anterior) / cliques_30d_anterior) * 100` |
| Delta de usuários | Porcentagem | `((total - periodo_anterior) / periodo_anterior) * 100` |
| Satisfação (landing) | Porcentagem | `(usuários_com_cliques / total_usuários_ativos) * 100` |
| Crescimento diário | Série temporal | Agregação de `created_at` por dia (últimos 30 dias) |
| Atividade horária | Distribuição | Cliques agrupados por hora do dia (0-23) |
| Distribuição por país | Ranking | Cliques agrupados por país, ordenados |
| Engajamento | Histograma | Usuários agrupados por quantidade de links criados |

### Insights Disponíveis
- Qual link tem mais cliques (top 10)
- Em quais horários os cliques acontecem (pico de atividade)
- De quais países vêm os cliques
- Quantos links cada usuário cria em média
- Tendência de crescimento de usuários e cliques

---

## API Routes

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| POST | `/api/links` | JWT | Criar link |
| PUT | `/api/links` | JWT | Atualizar link |
| DELETE | `/api/links` | JWT | Excluir link |
| POST | `/api/click` | Pública | Registrar clique (com geolocalização) |
| GET | `/api/health` | Nenhuma | Health check |

---

## Arquitetura

```
Usuário → Navegador → Next.js (App Router)
                          │
                    ┌─────┴──────┐
                    │ Server     │ Client
                    │ Actions    │ Components
                    └─────┬──────┘
                          │
               ┌──────────┴──────────┐
               │ Supabase (Postgres) │
               │   + RLS Policies    │
               └─────────────────────┘
```

- **Server Actions**: operações de escrita (CRUD de links, atualização de perfil/tema, upload)
- **API Routes**: registro de cliques (público) e CRUD de links (via fetch do cliente)
- **Middleware**: refresh de sessão, proteção de rotas, headers de segurança
- **RLS**: segurança em nível de banco — cada tabela tem políticas que garantem que usuários só acessem seus próprios dados

---

## Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários registrados (espelha `auth.users`) |
| `profiles` | Perfis com bio, tema, cores customizadas (1:1 com users) |
| `links` | Links da bio (com ícone, ordem, suporte a ícone customizado) |
| `clicks` | Registros de clique (com IP, país, cidade) |
| `registration_rate_limits` | Rate limiting de registro (hash de IP) |

### Relacionamentos

```
users 1──1 profiles
users 1──N links
users 1──N clicks
links 1──N clicks
```

### Scripts SQL
- `supabase/schema.sql` — Criação completa do banco (tabelas, índices, RLS, triggers)
- `supabase/seed.sql` — Dados de demonstração (5 usuários, 14 links, cliques distribuídos)
- `supabase/migrations/` — Migrações incrementais

---

## Licença

MIT
