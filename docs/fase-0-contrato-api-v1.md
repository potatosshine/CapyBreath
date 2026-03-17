# Fase 0 — Contrato oficial API v1 (CapyBreath)

Este documento inicia a **Fase 0 (alinhamento de contrato)** e consolida os endpoints reais do backend para integração com o frontend.

## 1) Fonte da verdade do contrato

### Decisão
- **Origem oficial**: OpenAPI exposto pelo backend FastAPI (`/openapi.json`).
- **Referência operacional atual**: routers e schemas em `backend/app/api/v1/endpoints/*` e `backend/app/schemas/*`.
- **Padrão recomendado para o frontend**: gerar tipos cliente a partir de OpenAPI (fase seguinte), evitando drift de contrato.

### Convenções globais
- Prefixo de API: `/api/v1`.
- Autenticação em endpoints protegidos: `Authorization: Bearer <access_token>`.
- Nomenclatura canônica de tokens:
  - `access_token`
  - `refresh_token`

---

## 2) Matriz de contrato (Auth, User, Session, Achievement)

## Auth (`/api/v1/auth`)

| Método | Rota | Auth | Request (resumo) | Response (resumo) |
|---|---|---|---|---|
| POST | `/register` | Não | `UserRegister` (`email`, `username`, `password`, `full_name?`) | `{ user, tokens }` |
| POST | `/login` | Não | `UserLogin` (`email`, `password`) | `{ user, tokens }` |
| POST | `/refresh` | Não | `TokenRefresh` (`refresh_token`) | `AccessTokenResponse` (`access_token`, `token_type`, `expires_in`) |
| POST | `/logout` | Sim | sem body | `MessageResponse` |
| GET | `/me` | Sim | — | `UserLoginResponse` |

### Shape de tokens (oficial)
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

## Users (`/api/v1/users`)

| Método | Rota | Auth | Request (resumo) | Response (resumo) |
|---|---|---|---|---|
| GET | `/me` | Sim | — | `UserResponse` |
| PATCH | `/me` | Sim | `UserUpdate` (`full_name?`, `avatar_url?`) | `UserResponse` |
| GET | `/me/stats` | Sim | `use_cache?` | `UserStatsResponse` |
| GET | `/me/profile` | Sim | — | `UserProfile` |
| DELETE | `/me` | Sim | — | `MessageResponse` |
| GET | `/leaderboard/retention` | Não | `limit?` | `UserStatsResponse[]` |
| GET | `/leaderboard/streak` | Não | `limit?` | `UserStatsResponse[]` |
| GET | `/leaderboard/active` | Não | `limit?` | `UserStatsResponse[]` |
| GET | `/search` | Não | `q`, `limit?` | `UserResponse[]` |

---

## Sessions (`/api/v1/sessions`)

| Método | Rota | Auth | Request (resumo) | Response (resumo) |
|---|---|---|---|---|
| POST | `` | Sim | `SessionCreate` | `SessionDetailResponse` |
| GET | `` | Sim | `page`, `size`, `order_by`, `order_dir` | `PaginatedResponse[SessionListItem]` |
| GET | `/{session_id}` | Sim | — | `SessionDetailResponse` |
| PATCH | `/{session_id}` | Sim | `SessionUpdate` | `SessionResponse` |
| DELETE | `/{session_id}` | Sim | — | `MessageResponse` |
| GET | `/stats/summary` | Sim | `use_cache?` | `SessionsSummary` |
| GET | `/stats/progress` | Sim | `days?` | `ProgressResponse` |
| GET | `/stats/mood` | Sim | — | `MoodCorrelationResponse` |
| GET | `/filter/by-date` | Sim | `start_date`, `end_date` | `SessionResponse[]` |
| GET | `/filter/by-technique/{technique_variant}` | Sim | path param | `SessionResponse[]` |
| GET | `/personal-best` | Sim | — | `SessionDetailResponse` |
| GET | `/personal-bests/recent` | Sim | `days?` | `SessionDetailResponse[]` |

> Observação: para `GET /sessions`, o frontend deve consumir `items` da resposta paginada, e não array direto na raiz.

---

## Achievements (`/api/v1/achievements`)

| Método | Rota | Auth | Request (resumo) | Response (resumo) |
|---|---|---|---|---|
| GET | `` | Não | `include_hidden?` | `AchievementResponse[]` |
| GET | `/category/{category}` | Não | path param | `AchievementResponse[]` |
| GET | `/rarity/{rarity}` | Não | path param | `AchievementResponse[]` |
| GET | `/stats` | Não | — | `dict` |
| GET | `/me` | Sim | `use_cache?` | `UserAchievementsResponse` |
| GET | `/me/{achievement_id}` | Sim | path param | `AchievementDetail` |
| POST | `/check` | Sim | — | `{ newly_unlocked, count, message }` |

### Rotas administrativas ocultas no schema
- `POST /admin/create`
- `PATCH /admin/{achievement_id}`
- `POST /admin/{achievement_id}/deactivate`

> Observação: **não existe** rota `POST /achievements/{id}/unlock` no backend atual.

---

## 3) Decisões de contrato para o frontend (saída da Fase 0)

1. Toda integração deve assumir `tokens` aninhado em `login/register`:
   - `response.data.tokens.access_token`
   - `response.data.tokens.refresh_token`
2. Refresh token deve enviar body com `refresh_token`.
3. Atualização de perfil usa `PATCH /users/me` (não `PUT`).
4. Listagem de sessões deve tratar paginação (`items`, `total`, `page`, `size`, `pages`).
5. Fluxo de conquistas deve usar `/achievements/check` e `/achievements/me`.

---

## 4) Checklist de pronto da Fase 0

- [x] Contrato Auth validado.
- [x] Contrato Users validado.
- [x] Contrato Sessions validado.
- [x] Contrato Achievements validado.
- [x] Fonte da verdade definida.
- [x] Convenção de tokens oficializada.

Próximo passo: executar Fase 1 (correções críticas de autenticação no frontend).
