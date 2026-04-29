# CapyBreath — Visual Style Guide (Production Ready)

Baseado na inspeção do projeto atual (React + Vite + Tailwind + `src/index.css` global). Este guia padroniza tokens para uso com CSS custom properties sem dependências externas adicionais.

## 1. Color token table (hex values + contrast ratios)

| Token | Hex | Uso | Contraste recomendado | WCAG AA |
|---|---|---|---|---|
| `--color-primary` | `#5C4A3A` | CTA principal, navbar, botões primários | texto branco sobre `primary`: **8.41:1** | ✅ |
| `--color-secondary` | `#846C4F` | estados secundários, badges quentes | texto branco sobre `secondary`: **4.95:1** | ✅ |
| `--color-accent` | `#4A7C59` | links ativos, foco, destaque positivo | texto branco sobre `accent`: **4.86:1** | ✅ |
| `--color-neutral-50` | `#F8F5F1` | fundo global | com `text-primary`: **13.90:1** | ✅ |
| `--color-neutral-100` | `#F1ECE6` | superfícies suaves alternadas | com `text-primary`: **12.82:1** | ✅ |
| `--color-neutral-200` | `#E4DCD3` | divisores suaves | com `text-primary`: **10.93:1** | ✅ |
| `--color-neutral-300` | `#D9CFC4` | bordas padrão | UI/borda sobre fundo `neutral-50`: **1.39:1** (use com espessura/agrupamento, não texto) | ✅ UI |
| `--color-neutral-700` | `#5F544A` | texto secundário | sobre `background`: **6.77:1** | ✅ |
| `--color-neutral-900` | `#2F241C` | texto principal | sobre `background`: **13.90:1** | ✅ |
| `--color-background` | `#F8F5F1` | canvas da página | - | - |
| `--color-surface` | `#FFFFFF` | cards, inputs, painéis | com `text-primary`: **15.11:1** | ✅ |
| `--color-text-primary` | `#2F241C` | texto principal | em `surface`: **15.11:1** | ✅ |
| `--color-text-secondary` | `#5F544A` | texto de apoio | em `surface`: **7.36:1** | ✅ |
| `--color-border` | `#D9CFC4` | contornos e separadores | em `surface`: **1.51:1** (UI >= 3:1 exige reforço via sombra/espessura em elementos críticos) | ⚠️ |
| `--color-success` | `#2E7D4F` | feedback positivo | em `background`: **4.64:1** | ✅ |
| `--color-warning` | `#8A5A12` | alertas moderados | em `background`: **5.44:1** | ✅ |
| `--color-error` | `#B23A3A` | erros e validação | em `background`: **5.43:1** | ✅ |

### Visual swatches

| Swatch | Token | Hex |
|---|---|---|
| 🟫 | `--color-primary` | `#5C4A3A` |
| 🟤 | `--color-secondary` | `#846C4F` |
| 🟩 | `--color-accent` | `#4A7C59` |
| ⬜ | `--color-surface` | `#FFFFFF` |
| 🤍 | `--color-background` | `#F8F5F1` |
| ✅ | `--color-success` | `#2E7D4F` |
| ⚠️ | `--color-warning` | `#8A5A12` |
| ⛔ | `--color-error` | `#B23A3A` |

## 2. Typography table

| Token | Valor | Uso |
|---|---|---|
| `--font-family-base` | `Inter, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif` | base global |
| `--font-weight-regular` | `400` | body/caption |
| `--font-weight-medium` | `500` | labels e botões |
| `--font-weight-semibold` | `600` | subtítulos |
| `--font-weight-bold` | `700` | títulos e CTAs |
| `--font-size-xs` + `--line-height-xs` | `12px / 1.4` | microcopy, meta |
| `--font-size-sm` + `--line-height-sm` | `14px / 1.5` | legenda, helper text |
| `--font-size-base` + `--line-height-base` | `16px / 1.6` | corpo padrão |
| `--font-size-lg` + `--line-height-lg` | `18px / 1.6` | lead text |
| `--font-size-xl` + `--line-height-xl` | `20px / 1.4` | heading H4 |
| `--font-size-2xl` + `--line-height-2xl` | `24px / 1.3` | heading H3 |
| `--font-size-3xl` + `--line-height-3xl` | `30px / 1.2` | heading H2/H1 compacto |

## 3. Spacing table

| Token | px | Uso |
|---|---|---|
| `--space-1` | 4px | ajuste fino |
| `--space-2` | 8px | gaps compactos |
| `--space-3` | 12px | texto + ícone |
| `--space-4` | 16px | padding base |
| `--space-6` | 24px | blocos internos |
| `--space-8` | 32px | separação de seções |
| `--space-12` | 48px | respiro vertical amplo |
| `--space-16` | 64px | seções principais |

Breakpoints e containers:
- Mobile: `< 768px`
- Tablet: `768px – 1024px`
- Desktop: `> 1024px`
- `--container-mobile: 100%`
- `--container-tablet: 704px`
- `--container-desktop: 1152px`

## 4. Complete CSS custom properties file (`:root {}`)

```css
:root {
  --color-primary: #5c4a3a;
  --color-secondary: #846c4f;
  --color-accent: #4a7c59;
  --color-neutral-50: #f8f5f1;
  --color-neutral-100: #f1ece6;
  --color-neutral-200: #e4dcd3;
  --color-neutral-300: #d9cfc4;
  --color-neutral-500: #8a7f74;
  --color-neutral-700: #5f544a;
  --color-neutral-900: #2f241c;

  --color-background: var(--color-neutral-50);
  --color-surface: #ffffff;
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-700);
  --color-border: var(--color-neutral-300);
  --color-success: #2e7d4f;
  --color-warning: #8a5a12;
  --color-error: #b23a3a;

  --font-family-base: 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  --line-height-xs: 1.4;
  --line-height-sm: 1.5;
  --line-height-base: 1.6;
  --line-height-lg: 1.6;
  --line-height-xl: 1.4;
  --line-height-2xl: 1.3;
  --line-height-3xl: 1.2;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  --container-mobile: 100%;
  --container-tablet: 44rem;
  --container-desktop: 72rem;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgb(47 36 28 / 10%);
  --shadow-md: 0 4px 16px rgb(47 36 28 / 12%);

  --focus-ring: 0 0 0 3px rgb(74 124 89 / 28%);
  --touch-target-min: 44px;

  --breakpoint-mobile-max: 47.99rem;
  --breakpoint-tablet-min: 48rem;
  --breakpoint-desktop-min: 64rem;
}
```

## 5. Component HTML + CSS code blocks

### Button (primary, secondary, ghost + disabled)

```html
<div class="btn-row">
  <button class="btn btn--primary">Salvar sessão</button>
  <button class="btn btn--secondary">Ver histórico</button>
  <button class="btn btn--ghost">Cancelar</button>
  <button class="btn btn--primary" disabled>Desativado</button>
</div>
```

```css
.btn-row { display: flex; flex-wrap: wrap; gap: var(--space-3); }

.btn {
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
  border-radius: var(--radius-pill);
  padding: var(--space-2) var(--space-4);
  border: 1px solid transparent;
  font: var(--font-weight-medium) var(--font-size-base)/var(--line-height-base) var(--font-family-base);
  cursor: pointer;
}

.btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn--primary { background: var(--color-primary); color: #fff; }
.btn--secondary { background: var(--color-secondary); color: #fff; }
.btn--ghost { background: transparent; color: var(--color-primary); border-color: var(--color-primary); }
```

### Input field (default, focus, error)

```html
<label class="field">
  <span class="field__label">Email</span>
  <input class="field__input" type="email" placeholder="voce@email.com" />
  <span class="field__help">Nunca compartilhamos seu email.</span>
</label>

<label class="field field--error">
  <span class="field__label">Senha</span>
  <input class="field__input" type="password" value="123" />
  <span class="field__help">Mínimo de 8 caracteres.</span>
</label>
```

```css
.field { display: grid; gap: var(--space-2); }
.field__label {
  color: var(--color-text-primary);
  font: var(--font-weight-medium) var(--font-size-sm)/var(--line-height-sm) var(--font-family-base);
}
.field__input {
  min-height: var(--touch-target-min);
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 var(--space-3);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font: var(--font-weight-regular) var(--font-size-base)/var(--line-height-base) var(--font-family-base);
}
.field__input:focus-visible {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: var(--focus-ring);
}
.field__help {
  color: var(--color-text-secondary);
  font: var(--font-weight-regular) var(--font-size-sm)/var(--line-height-sm) var(--font-family-base);
}
.field--error .field__input { border-color: var(--color-error); }
.field--error .field__help { color: var(--color-error); }
```

### Card (title, body, optional footer)

```html
<article class="card">
  <header class="card__header">
    <h3 class="card__title">Resumo da sessão</h3>
  </header>
  <div class="card__body">
    <p>Você concluiu 3 rounds e registrou retenção média de 1m40s.</p>
  </div>
  <footer class="card__footer">
    <button class="btn btn--primary">Detalhes</button>
  </footer>
</article>
```

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}
.card__title {
  color: var(--color-text-primary);
  font: var(--font-weight-semibold) var(--font-size-xl)/var(--line-height-xl) var(--font-family-base);
}
.card__body { color: var(--color-text-secondary); }
.card__footer { display: flex; justify-content: flex-end; }
```

### Navigation bar (desktop + mobile hamburger)

```html
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="#">CapyBreath</a>

    <button class="nav__toggle" aria-expanded="false" aria-controls="menu">☰</button>

    <nav id="menu" class="nav__menu">
      <a href="#">Dashboard</a>
      <a href="#">Sessões</a>
      <a href="#">Conquistas</a>
      <a href="#">Perfil</a>
      <button class="btn btn--primary">Entrar</button>
    </nav>
  </div>
</header>
```

```css
.nav {
  background: var(--color-primary);
  color: #fff;
  border-bottom: 1px solid rgb(255 255 255 / 20%);
}
.nav__inner {
  width: min(100% - 2 * var(--space-4), var(--container-desktop));
  margin-inline: auto;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}
.nav__brand { color: #fff; text-decoration: none; font-weight: var(--font-weight-bold); }
.nav__toggle {
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  border: 1px solid rgb(255 255 255 / 40%);
  background: transparent;
  color: #fff;
  border-radius: var(--radius-sm);
}
.nav__menu {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 64px;
  background: var(--color-primary);
  padding: var(--space-4);
  flex-direction: column;
  gap: var(--space-3);
}
.nav__menu a { color: #fff; text-decoration: none; min-height: var(--touch-target-min); display: inline-flex; align-items: center; }

@media (min-width: 48rem) {
  .nav__toggle { display: none; }
  .nav__menu {
    position: static;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: transparent;
    padding: 0;
  }
}
```

### Page layout wrapper (header, main, footer)

```html
<div class="page">
  <header class="page__header">...</header>
  <main class="page__main">...</main>
  <footer class="page__footer">© CapyBreath</footer>
</div>
```

```css
.page {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: var(--color-background);
  color: var(--color-text-primary);
}
.page__main {
  width: min(100% - 2 * var(--space-4), var(--container-desktop));
  margin-inline: auto;
  padding-block: var(--space-8);
}
.page__footer {
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: var(--space-4);
  text-align: center;
}
```

## 6. Full-page layout example (desktop + mobile)

```html
<div class="page">
  <header class="nav">
    <div class="nav__inner">
      <a class="nav__brand" href="#">CapyBreath</a>
      <button class="nav__toggle" aria-expanded="false" aria-controls="menu">☰</button>
      <nav id="menu" class="nav__menu">
        <a href="#">Dashboard</a>
        <a href="#">Sessões</a>
        <a href="#">Conquistas</a>
        <a href="#">Perfil</a>
        <button class="btn btn--primary">Nova Sessão</button>
      </nav>
    </div>
  </header>

  <main class="page__main layout">
    <section class="card layout__hero">
      <h1 class="card__title">Respiração consciente, progresso consistente</h1>
      <p class="card__body">Acompanhe retenção, streak e humor com clareza visual e foco em bem-estar.</p>
      <div class="btn-row">
        <button class="btn btn--primary">Iniciar agora</button>
        <button class="btn btn--ghost">Ver histórico</button>
      </div>
    </section>

    <section class="card">
      <h2 class="card__title">Check-in rápido</h2>
      <label class="field">
        <span class="field__label">Como está seu foco hoje?</span>
        <input class="field__input" placeholder="Ex.: médio" />
        <span class="field__help">Use uma palavra curta para registrar.</span>
      </label>
    </section>

    <section class="card">
      <h2 class="card__title">Resumo</h2>
      <p class="card__body">3 sessões nesta semana · Melhor retenção: 2m05s.</p>
    </section>
  </main>

  <footer class="page__footer">© 2026 CapyBreath</footer>
</div>
```

```css
/* Mobile-first: uma coluna abaixo de 768px */
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  overflow-x: clip;
}

@media (min-width: 48rem) {
  .layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-8);
  }

  .layout__hero {
    grid-column: 1 / -1;
  }
}

@media (min-width: 64rem) {
  .layout {
    grid-template-columns: 2fr 1fr;
  }

  .layout__hero {
    grid-column: 1 / -1;
  }
}
```

### Regras de responsividade e bem-estar aplicadas
- Mobile-first em todos os blocos.
- Coluna única abaixo de `768px`.
- Touch targets mínimos de `44x44px`.
- `overflow-x: clip` + containers fluidos para evitar scroll horizontal.
- Hierarquia visual: 1 CTA dominante por seção.
- Paleta calma com contraste elevado (sem cinza sobre cinza).
- Espaçamento amplo para evitar densidade visual excessiva.
