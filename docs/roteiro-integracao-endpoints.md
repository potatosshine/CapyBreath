# CapyBreath — Análise Frontend/Backend e Roteiro de Integração de Endpoints

## Objetivo
Concluir a ligação entre frontend e backend, garantindo que os endpoints consumidos pelo frontend correspondam aos contratos reais expostos pela API (`/api/v1/*`), com autenticação e formatos de payload/response consistentes.

---

## Diagnóstico rápido

### 1) Autenticação (alto impacto)
- **Desalinhamento de payload no refresh token**:
  - Frontend envia `{ refresh }`.
  - Backend espera `{ refresh_token }`.
- **Desalinhamento de estrutura de resposta no login/registro**:
  - Frontend espera campos de topo `access`/`refresh`.
  - Backend retorna `{ user, tokens }` e os tokens vêm como `access_token`/`refresh_token` dentro de `tokens`.
- **Logout sem chamada de backend**:
  - Existe endpoint `POST /auth/logout`, mas no frontend o logout apenas limpa `localStorage`.

### 2) Usuário
- **Método HTTP incorreto para atualização de perfil**:
  - Frontend usa `PUT /users/me`.
  - Backend expõe `PATCH /users/me`.
- **Modelo de dados divergente**:
  - Tipo do frontend usa `name` e poucos campos.
  - Backend usa `username`, `full_name`, `avatar_url`, `is_active`, `is_verified`, etc.

### 3) Sessões
- **Formato de listagem divergente**:
  - Frontend espera `Session[]` direto em `GET /sessions`.
  - Backend retorna paginação (`PaginatedResponse`) com `items`, `total`, `page`, `size`, `pages`.
- **Tipo de sessão no frontend não representa contrato real**:
  - Frontend usa `start_time`/`end_time`.
  - Backend usa `session_date`, `duration_seconds`, `breaths_count`, `recovery_time`, etc.

### 4) Conquistas
- **Endpoint inexistente no backend sendo chamado pelo frontend**:
  - Frontend chama `POST /achievements/{id}/unlock`.
  - Backend não possui esse endpoint; o fluxo é via `POST /achievements/check` e leitura em `/achievements/me`.
- **Tipo de conquista no frontend está simplificado demais** para o retorno real do backend.

### 5) Camada de contrato
- A integração atual está **fortemente acoplada a suposições do frontend**, sem uma camada de normalização robusta para contratos de API versionados.

---

## Roteiro de tarefas (priorizado)

## Fase 0 — Alinhamento de contrato (bloqueante)
1. **Mapear contrato oficial da API v1** em um documento único (endpoint, método, request, response, auth).
2. **Definir fonte da verdade do frontend**:
   - opção A: tipagem manual alinhada ao backend,
   - opção B (recomendada): geração de tipos a partir de OpenAPI.
3. **Congelar nomenclatura de auth** (`access_token`, `refresh_token`) para toda a aplicação.

**Critério de pronto**: tabela de contratos validada para Auth, User, Session e Achievement.

### Status atual da Fase 0
- [x] Mapeamento inicial do contrato publicado em `docs/fase-0-contrato-api-v1.md`.
- [x] Definição da fonte da verdade documentada (OpenAPI como origem + tipagem gerada no frontend).
- [x] Convenção oficial de nomenclatura de autenticação documentada (`access_token` e `refresh_token`).

## Fase 1 — Correções críticas de autenticação
1. Ajustar `login/register` no frontend para ler `response.data.tokens.access_token` e `response.data.tokens.refresh_token`.
2. Ajustar `refreshToken` e interceptor para enviar `{ refresh_token }` e consumir `access_token`.
3. Integrar chamada de `POST /auth/logout` antes de limpar storage (com fallback local).
4. Validar fluxo completo:
   - login,
   - refresh automático em 401,
   - logout manual,
   - sessão inválida redirecionando para `/login`.

**Critério de pronto**: fluxo de sessão autenticada funciona fim-a-fim sem inconsistência de chave.

## Fase 2 — Usuário (perfil)
1. Alterar atualização de perfil para `PATCH /users/me`.
2. Revisar tipos de `User` no frontend para refletir contrato real (`username`, `full_name`, etc.).
3. Ajustar formulários/components para mapear campos corretamente (ex.: `name` -> `full_name`).

**Critério de pronto**: leitura e edição de perfil persistem corretamente no backend.

## Fase 3 — Sessões (CRUD + listagem)
1. Atualizar `getSessions` para consumir paginação e retornar `items` para a camada de UI.
2. Alinhar tipos de sessão com schema real (`session_date`, `duration_seconds`, `technique_variant` etc.).
3. Revisar criação de sessão para garantir payload completo mínimo do backend (`retention_time`, `duration_seconds`, etc.).
4. Adicionar suporte a paginação no estado/hook (`page`, `size`, `total`, `pages`).

**Critério de pronto**: criar, listar e consultar sessão por ID funcionando com dados corretos na UI.

## Fase 4 — Conquistas
1. Remover chamada a endpoint inexistente `POST /achievements/{id}/unlock`.
2. Implementar fluxo correto:
   - listar catálogo em `GET /achievements`,
   - estado do usuário em `GET /achievements/me`,
   - desbloqueio/checagem em `POST /achievements/check` (quando aplicável).
3. Ajustar tipagens para suportar bloqueadas/desbloqueadas e progresso.

**Critério de pronto**: tela de conquistas reflete estado real do usuário e progresso.

## Fase 5 — Robustez e DX
1. Normalizar tratamento de erros da API (mensagem de backend + fallback amigável).
2. Criar testes de integração de cliente (mock HTTP) para fluxos críticos:
   - auth,
   - perfil,
   - sessões listadas paginadas,
   - conquistas.
3. (Opcional forte) Adotar cliente gerado por OpenAPI para reduzir regressões de contrato.

**Critério de pronto**: cobertura dos fluxos críticos e menor risco de quebra por mudança de contrato.

---

## Backlog sugerido (ordem de execução prática)
1. Auth: login/register/refresh/logout.
2. User: `PATCH /users/me` + tipagem.
3. Sessions: paginação + schema.
4. Achievements: trocar fluxo de unlock para check/me.
5. Testes e endurecimento.

---

## Riscos e mitigação
- **Risco**: mudanças de tipo impactarem muitas telas ao mesmo tempo.
  - **Mitigação**: criar camada de adaptação temporária (`mappers`) entre API e UI.
- **Risco**: regressão silenciosa em refresh token.
  - **Mitigação**: testes automatizados do interceptor e do ciclo 401 -> refresh -> retry.
- **Risco**: divergência futura entre backend e frontend.
  - **Mitigação**: contrato versionado (OpenAPI) + geração de tipos.

---

## Definição de sucesso
- Todos os endpoints consumidos pelo frontend existem no backend e respondem no formato esperado.
- Fluxos críticos (autenticação, perfil, sessões e conquistas) funcionam fim-a-fim.
- Sem parsing ad-hoc de resposta fora da camada de API.
- Cobertura mínima dos fluxos críticos em testes de cliente.
