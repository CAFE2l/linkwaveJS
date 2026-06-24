<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Session Summary — Frutiger Aero UI Polish

## Goal
Polish the LinkWave Frutiger Aero UI/UX holistically — auth pages, dashboard (shell, stats, links, modals, icon picker), profile editor, customize panel, theme panel — to feel like a premium SaaS product, not an MVP.

## Constraints & Preferences
- Homepage is the visual reference: glassmorphism, soft aqua/blue gradients, rounded translucent containers, glossy buttons, subtle shadows, white borders, spacing harmony
- All pages must follow identical Frutiger Aero design language (login, register, dashboard, profile, customize, theme)
- Do NOT break existing routes, Supabase auth, protected pages, RLS, or form submission logic — only restructure CSS/components
- Auth pages: two-column layout on desktop (benefits left, glass form right), stacked on mobile
- Inputs must have glass styling: translucent white background, white border, backdrop blur, proper icon placement, premium focus states
- Buttons must have glossy gradients, shadow, hover lift, active scale
- Dashboard top navbar must match landing page glass-nav style; nav tabs use glass pill-style active state
- Profile card, link form, stats cards, icon picker, modals must be visually consistent with glass-substance
- Add decorative Frutiger Aero elements: soft glow bubbles (BlobBackground), glass reflections, subtle gradients, depth

## Done
- DashboardShell: glass-nav header (sticky, rounded, translucent, white borders, backdrop blur, icon + brand + user area); nav tabs glass pill-style; wraps ThemeProvider + landing-bg + BlobBackground internally
- StatsCards: glass-stat cards with glass icon containers
- LinkForm: glass inputs (raw `<input>` with glassInput class) + glossy gradient submit button
- IconPicker: glass trigger button, glass-card-strong dropdown, glass search, glass grid items
- LinksManager: glass-card-strong new-link section, glass sortable link cards, glass EmptyState; edit/delete as raw glass icon buttons
- EditLinkModal / DeleteLinkModal: glass-card-strong modals, glass close/label/cancel/confirm buttons; delete uses red gradient
- ProfileEditor: glass-card-strong wrapper, glass dashed banner, glass avatar circle, glass inputs, glossy save
- CustomizePanel: glass pill-tab bar, glass-card-strong links placeholder, glossy save button; removed all Button/Card imports
- ProfileForm: glass-card-strong with raw glass inputs/textarea/username field, glossy save button; removed all UI imports
- AvatarUpload: glass-card-strong with glass avatar circle + raw glass buttons; removed all UI imports
- BannerUpload: glass-card-strong with glass dashed banner + raw glass button; removed all UI imports
- ThemeSection: all 6 sections from `<Card>` blocks to `glass-card-strong p-5`; Toggle/SliderRow/ColorRow use glass classes; removed all UI imports
- ThemeCustomizer: full refactor — `card` → `glass-card-strong`, `<Button>` → raw glass `<button>`, uses glass pill active states, ocean/60 text, accent-cyan-500; removed Button import
- Profile page: removed duplicate ThemeProvider/BlobBackground/landing-bg (DashboardShell provides them now)
- No remaining imports to `@/components/ui/card` or `@/components/ui/button` in `src/`
- Build passes cleanly

## Key Decisions
- DashboardShell provides ThemeProvider + BlobBackground + landing-bg internally, removing page-level duplication for profile/customize/theme pages (but NOT for /dashboard which uses FullDashboard independently)
- Raw `<button>`/`<input>` elements with CSS constants (glassInput, glassBtn) instead of modifying existing Button/Input UI components — avoids risk of breaking other usages
- All existing form/logic/action code untouched — only presentation changed

## Relevant Files
- `src/app/globals.css`: glass-* classes, landing-bg gradient
- `src/components/landing/blob-background.tsx`: animated floating blobs
- `src/components/dashboard/dashboard-shell.tsx`: glass nav + tabs + background
- `src/components/dashboard/stats-cards.tsx`, `link-form.tsx`, `icon-picker.tsx`, `links-manager.tsx`, `edit-modal.tsx`
- `src/components/profile/profile-editor.tsx`
- `src/components/customize/customize-panel.tsx`, `profile-form.tsx`, `avatar-upload.tsx`, `banner-upload.tsx`, `theme-section.tsx`, `preview.tsx`
- `src/components/theme/theme-customizer.tsx`
- `src/app/profile/page.tsx`
