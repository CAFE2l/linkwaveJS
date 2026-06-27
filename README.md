# 🌊 LinkWave

<div align="center">

![LinkWave](https://img.shields.io/badge/LinkWave-Frutiger%20Aero-00C8FF?style=for-the-badge)

**Links para criadores, do seu jeito.**

Uma plataforma moderna de **Link in Bio** desenvolvida para criadores de conteúdo, empreendedores, freelancers e empresas que desejam centralizar toda sua presença digital em uma única página totalmente personalizável.

---

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)

</div>

---

# 📖 Sobre o Projeto

O **LinkWave** é uma plataforma de **Link in Bio** desenvolvida para reunir todos os links de um usuário em uma única página pública e altamente personalizável.

Diferentemente das soluções tradicionais, o projeto prioriza:

* 🎨 Personalização avançada
* ⚡ Performance
* 📊 Analytics integrado
* 🔒 Segurança
* 📱 Interface moderna inspirada em Frutiger Aero
* 🌐 Identidade visual própria

O objetivo é permitir que criadores de conteúdo, empresas e profissionais concentrem toda sua presença digital em um único lugar de forma simples, intuitiva e profissional.

---

# 🚀 Funcionalidades

## 👤 Autenticação

* Cadastro
* Login
* Recuperação de senha
* Logout
* Gerenciamento de sessão

---

## 🌐 Perfil Público

Cada usuário possui uma página exclusiva.

Exemplo:

```text
linkwave.app/cafe
```

O perfil pode conter:

* Avatar
* Nome
* Bio
* Links
* Redes sociais
* Tema personalizado

---

## 🔗 Gerenciamento de Links

O usuário pode:

* Criar links
* Editar links
* Excluir links
* Reordenar links
* Definir ícones
* Personalizar aparência

---

## 📊 Dashboard

O painel administrativo permite visualizar:

* Estatísticas
* Cliques
* Links cadastrados
* Evolução temporal
* Crescimento da plataforma

---

# 🏗 Arquitetura

O projeto segue uma arquitetura moderna baseada em separação de responsabilidades.

```text
Usuário
      │
      ▼
Interface Web (Next.js)
      │
      ▼
Server Actions / API Routes
      │
      ▼
Validação (Zod)
      │
      ▼
Supabase Auth
      │
      ▼
PostgreSQL
      │
      ▼
Resposta
      │
      ▼
Atualização da Interface
```

Toda validação crítica é realizada no servidor.

---

# 🗄 Banco de Dados

Modelo simplificado:

```text
auth.users
      │
      ▼
public.users
      │
      ├────────► public.profiles
      │
      ├────────► public.links
      │               │
      │               ▼
      └────────────► public.clicks

registration_rate_limits
```

Principais tabelas:

### users

Armazena informações dos usuários.

---

### profiles

Responsável pelas configurações públicas.

---

### links

Contém todos os links criados pelos usuários.

---

### clicks

Registra acessos utilizados nas estatísticas.

---

### registration_rate_limits

Proteção contra spam e abuso de cadastro.

---

# 📈 Analytics

O módulo analítico transforma os dados da plataforma em informações úteis.

Métricas disponíveis:

* Total de usuários
* Total de links
* Cliques registrados
* Ranking de links
* Distribuição geográfica
* Evolução temporal

Visualização construída utilizando **Recharts**.

---

# 🛡 Segurança

O projeto utiliza diversas camadas de proteção.

* Supabase Auth
* PostgreSQL
* Row Level Security (RLS)
* Validação com Zod
* Server Actions
* API Routes
* Rate Limit

---

# 💻 Tecnologias

## Front-end

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Framer Motion

## Back-end

* Server Actions
* API Routes

## Banco de Dados

* PostgreSQL
* Supabase

## Validação

* Zod
* React Hook Form

## Analytics

* Recharts

## Testes

* Playwright

---

# 🎨 Design

A identidade visual foi inspirada no movimento **Frutiger Aero**, buscando uma interface moderna, leve e tecnológica.

Características:

* Glassmorphism
* Gradientes suaves
* Efeitos de profundidade
* Animações fluidas
* UI responsiva
* Experiência premium

---

# 📂 Estrutura do Projeto

```text
src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── styles/
├── types/
├── utils/
└── middleware.ts

public/
├── icons/
├── images/
└── videos/
```

---

# ⚙️ Instalação

Clone o projeto:

```bash
git clone https://github.com/SEU-USUARIO/linkwave.git
```

Entre na pasta:

```bash
cd linkwave
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Execute o projeto:

```bash
npm run dev
```

---

# 🌐 Deploy

O projeto foi desenvolvido para ser hospedado na **Vercel**, utilizando o Supabase como backend.

---

# 👥 Equipe

* Gabriel Felipe Sabino de Souza
* Lucas Daniel Carvalho de Castilho
* Emelly de Mello Giovanini

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos e de aprendizado.

---

<div align="center">

### LinkWave

**Links para criadores, do seu jeito.**

Desenvolvido com ❤️ utilizando Next.js, TypeScript, Tailwind CSS e Supabase.

</div>
