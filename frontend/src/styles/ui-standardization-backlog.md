# CapyBreath — Mapeamento visual + backlog de padronização

Documento criado para mapear os arquivos responsáveis pelo visual atual e definir um backlog de padronização por página/sessão com base no guia `visual-style-guide.md` e tokens de `design-system.css`.

## 1) Mapeamento dos arquivos responsáveis pelo visual

## Camada global (base de estilo)

- `frontend/src/main.tsx`
  - Entrada da aplicação e rotas principais; determina quais páginas entram no fluxo visual.
- `frontend/src/index.css`
  - Carrega Tailwind (`@tailwind base/components/utilities`) + reset global básico.
- `frontend/tailwind.config.js`
  - Define paleta `capy.*` e influencia classes utilitárias usadas na UI.
- `frontend/src/styles/design-system.css`
  - Tokens de design system em CSS custom properties (`:root`).
- `frontend/src/styles/visual-style-guide.md`
  - Guia visual de referência com padrões de componente e layout.

## Shell/navigation e feedback global

- `frontend/src/components/Navbar.tsx`
  - Navegação principal (usuário autenticado e não autenticado).
- `frontend/src/components/Toast.tsx`
  - Feedback contextual de sucesso/erro/info.

## Jornada de respiração (home + sessão ativa)

- `frontend/src/App.tsx`
  - Landing inicial, sessão ativa, estado final e CTAs.
- `frontend/src/components/BreathingCircle.tsx`
  - Elemento visual principal da prática.
- `frontend/src/components/BreathCounter.tsx`
  - Contador/progresso de respiração.
- `frontend/src/components/Timer.tsx`
  - Relógio de retenção/recuperação.

## Páginas de autenticação

- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/features/auth/LoginForm.tsx`
- `frontend/src/pages/RegisterPage.tsx`
- `frontend/src/features/auth/RegisterForm.tsx`

## Dashboard e comunidade

- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/pages/CommunityPage.tsx`

## Sessões (histórico + detalhe)

- `frontend/src/pages/SessionPage.tsx`
- `frontend/src/features/session/SessionHistory.tsx`
- `frontend/src/pages/SessionDetailPage.tsx`
- `frontend/src/features/session/SessionDetails.tsx`

## Conquistas

- `frontend/src/pages/AchievementsPage.tsx`
- `frontend/src/features/achievement/AchievementList.tsx`
- `frontend/src/features/achievement/AchievementItem.tsx`

## Perfil

- `frontend/src/pages/ProfilePage.tsx`
- `frontend/src/features/user/UserProfile.tsx`
- `frontend/src/features/user/EditProfileForm.tsx`

---

## 2) Backlog de padronização (por página/sessão)

Critérios de priorização:

- **P0**: inconsistências de acessibilidade/contraste/layout base e componentes compartilhados.
- **P1**: padronização de páginas de alto tráfego.
- **P2**: refinamento visual e redução de dívida de utilitárias.

## P0 — Base transversal (todas as telas)

### [P0-01] Integrar tokens globais no app

- **Status**: Concluído (base global tokenizada).
- **Escopo**: `index.css`, `main.tsx`.
- **Entregue neste ciclo**:
  - Import de `design-system.css` no stylesheet global.
  - Tipografia, cores de superfície/texto e foco global ligados aos tokens.
  - Estilização base para headings, links e elementos de formulário com herança de fonte.
- **Ações**:
  - Importar `styles/design-system.css` na camada global.
  - Definir estilos base para `body`, headings, links e estados de foco usando tokens.
  - Padronizar superfícies (`background/surface`) e texto (`text-primary/text-secondary`).
- **DoD**:
  - Nenhuma página usa hardcoded color fora dos tokens para elementos base.
  - Focus ring visível e consistente em elementos interativos.

### [P0-02] Criar camada de componentes base reutilizáveis

- **Status**: Concluído (DoD atendido para Auth, Dashboard e Session Detail).
- **Escopo**: novo `src/components/ui/*` (Button, Input, Card, Alert, PageContainer).
- **Entregue neste ciclo**:
  - Criação de componentes base: Button, Card, Alert, PageContainer e InputField.
  - Criação da folha `ui-primitives.css` com classes tokenizadas reutilizáveis.
  - Migração inicial de consumo para Auth (`LoginForm`, `RegisterForm`) e `SessionDetailPage`.
  - Migração de `DashboardPage` para `PageContainer`, `Card` e `Alert` da camada base.
- **Ações**:
  - Encapsular variantes do guia (primary/secondary/ghost, input com erro/foco, card padrão).
  - Substituir padrões repetidos de Tailwind solto por componentes base.
- **DoD**:
  - Pelo menos Auth, Dashboard e Session Detail usam os componentes base.

### [P0-03] Responsividade e touch targets mínimos

- **Status**: Concluído (DoD de responsividade/touch target atendido nas áreas P0).
- **Escopo**: Navbar, formulários, botões de paginação, CTAs de sessão.
- **Entregue neste ciclo**:
  - Navbar com navegação mobile (hambúrguer) e links com alvo mínimo de toque.
  - Paginação de `SessionHistory` migrada para botões padrão com alvo mínimo.
  - CTAs críticos de `App.tsx` ajustados para `min-h[44px]` e proteção de overflow horizontal.
  - Botões/links de ação final e agrupamentos de ação adaptados para mobile sem compressão horizontal.
- **Ações**:
  - Garantir `min 44x44` para interações em mobile.
  - Validar ausência de horizontal scroll em breakpoints `<768`, `768-1024`, `>1024`.
- **DoD**:
  - QA visual em 360px, 768px e 1280px sem quebra de layout.

---

## P1 — Padronização por página/sessão

### [P1-01] Home + Sessão ativa (`App.tsx`)

- **Status**: Concluído (estrutura e hierarquia padronizadas).
- **Entregue neste ciclo**:
  - Extração de blocos de layout para `SessionHero`, `SessionPanel` e `PhaseActionButton`.
  - Unificação de CTAs principais por fase com componente de ação dedicado.
  - Estrutura visual inicial da home/sessão aproximada ao guia (hierarquia e agrupamento).
- **Problemas atuais**:
  - Forte uso de classes utilitárias específicas por estado/fase; baixa reutilização.
  - Botões e painéis com estilos próprios não alinhados 1:1 ao guia.
- **Ações**:
  - Extrair “SessionHero”, “SessionPanel” e “PhaseCTA” usando tokens.
  - Garantir hierarquia: 1 CTA dominante por fase.
  - Revisar contraste de textos sobre gradiente e overlays translúcidos.
- **DoD**:
  - Todos os estados (`inicio`, `respiracao`, `retencao`, `recuperacao`, `finalizada`) usam padrões consistentes de tipografia/espaçamento.

### [P1-02] Navbar global (`Navbar.tsx`)

- **Status**: Concluído (desktop/mobile + acessibilidade base).
- **Entregue neste ciclo**:
  - Navegação desktop/mobile unificada por configuração de links (menos duplicação).
  - Botão hambúrguer com `aria-expanded`, `aria-controls` e rótulo dinâmico.
  - Fechamento automático do menu ao trocar rota e ao pressionar `Escape`.
  - Estado ativo de navegação com `aria-current="page"` e destaque visual consistente.
- **Problemas atuais**:
  - Versão desktop sem tratamento explícito para menu mobile hamburguer.
- **Ações**:
  - Implementar padrão do guia para navbar desktop+mobile.
  - Garantir ordem de navegação por teclado e foco visível.
- **DoD**:
  - Navbar funcional e legível em mobile e desktop.

### [P1-03] Login/Register (`LoginForm.tsx`, `RegisterForm.tsx`)

- **Status**: Concluído (layout, estados e consistência visual unificados).
- **Entregue neste ciclo**:
  - Criação de `AuthFormCard` para padronizar estrutura (header, body e footer) dos formulários.
  - Unificação dos fluxos Login/Register com o mesmo layout-base e alerta de erro tokenizado.
  - Ajuste de helper text/regra mínima de senha no cadastro.
- **Problemas atuais**:
  - Formulários similares, mas sem componente compartilhado de campo/erro.
- **Ações**:
  - Migrar para InputField + FormCard padrão.
  - Unificar mensagens de erro/sucesso com Alert tokenizado.
  - Aplicar ritmo de espaçamento do grid 8pt.
- **DoD**:
  - UI idêntica em estrutura visual entre login e cadastro, mudando apenas conteúdo.

### [P1-04] Dashboard (`DashboardPage.tsx`)

- **Problemas atuais**:
  - Muitos cards com pequenas variações de borda/sombra/texto.
- **Ações**:
  - Unificar cards em variantes (`metric`, `summary`, `list`, `status`).
  - Normalizar hierarquia de título/subtexto/valor.
  - Padronizar estados de loading/erro/empty.
- **DoD**:
  - Grid responsivo consistente e sem diferenças visuais arbitrárias entre cards.

### [P1-05] Sessões — Histórico (`SessionHistory.tsx`)

- **Problemas atuais**:
  - Lista e paginação com controles compactos e pouca distinção semântica.
- **Ações**:
  - Transformar itens em list-cards clicáveis com hover/focus coerentes.
  - Usar botão padrão para paginação (anterior/próxima).
  - Padronizar badge de personal best.
- **DoD**:
  - Leitura rápida dos itens e controles de paginação com touch target adequado.

### [P1-06] Sessões — Detalhe (`SessionDetailPage.tsx`, `SessionDetails.tsx`)

- **Problemas atuais**:
  - Formulário e detalhes usam estilos próximos, porém não centralizados.
- **Ações**:
  - Aplicar Card/Input/Button padrão em todo fluxo de edição.
  - Padronizar alerts de erro e confirmação.
  - Revisar alinhamento dos blocos de métricas em mobile.
- **DoD**:
  - Tela de detalhe fica visualmente equivalente às demais telas de dados.

### [P1-07] Conquistas (`AchievementList.tsx`, `AchievementItem.tsx`)

- **Problemas atuais**:
  - Itens unlocked/locked com cores fixas não totalmente tokenizadas.
- **Ações**:
  - Migrar cores de estado para tokens semânticos (success/surface/text/border).
  - Padronizar aside de detalhe como Card sticky em desktop, estático em mobile.
  - Uniformizar filtros com Input/Select padrão.
- **DoD**:
  - Grade de conquistas consistente com dashboard e sessão.

### [P1-08] Comunidade (`CommunityPage.tsx`)

- **Problemas atuais**:
  - Padrões mistos de cards/listas e formulário de busca.
- **Ações**:
  - Aplicar componentes base em leaderboard e busca.
  - Definir escala de destaque para ranking (#1, #2, #3) sem saturação excessiva.
- **DoD**:
  - Comunidade visualmente integrada ao restante do app.

### [P1-09] Perfil (`UserProfile.tsx`, `EditProfileForm.tsx`, `ProfilePage.tsx`)

- **Problemas atuais**:
  - Duas seções com estilos próprios e desalinhamentos de largura.
- **Ações**:
  - Criar layout único de perfil com coluna principal + bloco de edição.
  - Padronizar botões de ação (salvar/sair) e cartões de estatística.
- **DoD**:
  - Perfil com fluxo visual contínuo e sem quebra de ritmo entre blocos.

---

## P2 — Refinamento e governança visual

### [P2-01] Redução de classes utilitárias duplicadas

- Mapear padrões repetidos e migrar para classes utilitárias internas (`@layer components`) ou wrappers TSX.

### [P2-02] Checklist de acessibilidade visual contínuo

- Contraste AA para texto e estados de erro/sucesso.
- Estados de foco keyboard-first em todos os controles.

### [P2-03] Storybook leve (opcional)

- Catalogar Button/Input/Card/Alert/Navbar e variantes para evitar regressão visual.

### [P2-04] Critérios de revisão de PR (UI)

- Adicionar checklist no template de PR: tokens, responsividade, contraste, touch target e sem horizontal scroll.

---

## 3) Sequência de execução sugerida (sprints)

### Sprint 1 (P0)

1. Integrar tokens globais.
2. Criar componentes base de UI.
3. Ajustar navbar responsiva + foco/touch targets.

### Sprint 2 (P1 Core)

1. Home/sessão ativa.
2. Auth (login/register).
3. Dashboard.

### Sprint 3 (P1 Data Pages)

1. Sessões (histórico + detalhe).
2. Conquistas.
3. Comunidade.
4. Perfil.

### Sprint 4 (P2)

1. Governança visual, redução de duplicação e checklist de PR.

---

## 4) Resultado esperado

- Sistema visual unificado entre todas as páginas.
- Menos dívida de UI por repetição de classes.
- Acessibilidade e responsividade consistentes.
- Base pronta para evolução futura sem regressão de identidade visual.
