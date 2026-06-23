# AgentPay Frontend

Dashboard and Stellar wallet integration for the AgentPay protocol (machine-to-machine payments on Stellar).

## Overview

- **Stack:** Next.js 16, React, TypeScript, Tailwind CSS
- **Purpose:** AgentPay branding, dashboard placeholder, and future wallet/API integration

## Prerequisites

- Node.js 18+
- npm

## Setup for contributors

1. **Clone the repo** (or add remote and pull):

   ```bash
   git clone <repo-url> && cd agentpay-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Verify setup**:

   ```bash
   npm run build
   npm test
   ```

4. **Run locally**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
agentpay-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── page.tsx                                 # /
│   │   ├── about/page.tsx                           # /about
│   │   ├── admin/page.tsx                           # /admin
│   │   ├── agents/page.tsx                         # /agents
│   │   │   └── [agent]/page.tsx                   # /agents/:agent
│   │   ├── api-keys/page.tsx                      # /api-keys
│   │   ├── changelog/page.tsx                      # /changelog
│   │   ├── docs/page.tsx                           # /docs
│   │   ├── events/page.tsx                        # /events
│   │   ├── export/page.tsx                        # /export
│   │   ├── search/page.tsx                        # /search
│   │   ├── services/page.tsx                     # /services
│   │   │   ├── [serviceId]/page.tsx            # /services/:serviceId
│   │   │   ├── [serviceId]/agents/page.tsx    # /services/:serviceId/agents
│   │   │   └── [serviceId]/edit/page.tsx      # /services/:serviceId/edit
│   │   │   └── new/page.tsx                   # /services/new
│   │   ├── settings/page.tsx                     # /settings
│   │   ├── stats/page.tsx                        # /stats
│   │   ├── usage/page.tsx                        # /usage
│   │   ├── webhooks/page.tsx                     # /webhooks
│   │   └── (shared components & libs live outside app/)
│   ├── components/                                # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   └── lib/                                       # API client, hooks, formatting, etc.
│       ├── apiClient.ts
│       ├── resolveApiBase.ts
│       ├── useApi.ts
│       └── ...
├── package.json
├── jest.config.ts
├── jest.setup.ts
└── .github/workflows/
    └── ci.yml                                    # CI: build, test
```

## Route map (frontend)

Backend endpoints are taken from the companion documentation page `src/app/docs/page.tsx` and from the API client usage throughout `src/app/*`.

| Path                          | Purpose                                      | Backend endpoints it calls                                                                                                                        |
| ----------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                           | Main dashboard landing                       | _(check app code in `src/app/page.tsx` and any hooks it uses)_                                                                                    |
| `/about`                      | About page                                   | _(static UI unless the page calls APIs)_                                                                                                          |
| `/admin`                      | Admin control surface (pause/unpause/status) | `POST /api/v1/admin/pause`, `POST /api/v1/admin/unpause`, _(reads status via GET `/api/v1/admin/status` in code)_                                 |
| `/agents`                     | Agents overview                              | _(reads agents list via `/api/v1/agents` in code)_                                                                                                |
| `/agents/:agent`              | Single-agent view                            | _(reads agent details via `/api/v1/agents/:agent` in code)_                                                                                       |
| `/api-keys`                   | API keys management                          | _(list/create/delete/update endpoints in code)_                                                                                                   |
| `/changelog`                  | Changelog                                    | _(static or calls `/api/v1/changelog` depending on implementation)_                                                                               |
| `/docs`                       | Short API endpoint reference                 | `GET /api/v1/openapi.json` plus the prose list rendered from `sections` in `src/app/docs/page.tsx` (usage, settle, services, admin pause/unpause) |
| `/events`                     | Event log renderer                           | _(reads events stream/poll via `/api/v1/events` endpoints in code)_                                                                               |
| `/export`                     | Export data                                  | _(calls export endpoints in code)_                                                                                                                |
| `/search`                     | Global search                                | _(calls search endpoint in code)_                                                                                                                 |
| `/services`                   | Services list                                | `GET /api/v1/services` _(and/or list related endpoints in code)_                                                                                  |
| `/services/:serviceId`        | Service details                              | `GET /api/v1/services/:serviceId` _(plus nested reads in code)_                                                                                   |
| `/services/:serviceId/agents` | Agents for a given service                   | `GET /api/v1/services/:serviceId/agents`                                                                                                          |
| `/services/:serviceId/edit`   | Edit service                                 | _(reads service + submits via service update endpoints in code)_                                                                                  |
| `/services/new`               | Create service                               | `POST /api/v1/services`                                                                                                                           |
| `/settings`                   | User/app settings                            | _(calls settings endpoints in code)_                                                                                                              |
| `/stats`                      | Statistics                                   | _(calls stats endpoints in code)_                                                                                                                 |
| `/usage`                      | Usage totals & settlement workflow           | `POST /api/v1/usage`, `GET /api/v1/usage/:agent/:serviceId`, `POST /api/v1/settle`                                                                |
| `/webhooks`                   | Webhooks management                          | _(calls webhooks endpoints in code)_                                                                                                              |

## Shared components

See [docs/components.md](docs/components.md) for the shared component catalog,
including prop tables, usage examples, and accessibility notes for the
primitives in `src/components`.

## Environment variables

| Variable                        | Visibility                      | Default                 | Purpose                                                                                                                                                                         |
| ------------------------------- | ------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_AGENTPAY_API_BASE` | public (bundled into client JS) | `http://localhost:3001` | Base URL for the AgentPay backend. Validated by `resolveApiBase()` in `src/lib/resolveApiBase.ts` and rejected in production if non-https except for `localhost` / `127.0.0.1`. |

Because the variable is `NEXT_PUBLIC_*`, its value is exposed to the browser. Never put API secrets in it - it is used only for routing public HTTP requests.

## Security headers

A baseline security header set (CSP, `X-Frame-Options: DENY`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`, HSTS) is wired up in `next.config.ts` via `src/lib/securityHeaders.ts`. The CSP `connect-src` directive tracks `NEXT_PUBLIC_AGENTPAY_API_BASE` automatically; `<a href>` links to external sites (`https://stellar.org`, etc.) remain navigable.

## Event log rendering

The `/events` page renders server-supplied JSON payloads. Each payload is serialised through `safeStringify` (`src/lib/format.ts`) with a hard cap (`EVENT_PAYLOAD_MAX_CHARS`, default 5,000 chars) and a visible `…(truncated)` marker. Circular references, `BigInt`, functions, and malformed timestamps are replaced with safe sentinels so a bad payload can't crash the page.

## Formatting conventions

The frontend formats currency (Stroops / XLM) consistently using the helper `formatStroops` (located in `src/lib/format.ts`):

- **Stroops definition:** 1 XLM = 10,000,000 stroops (Stellar's base unit).
- **Sub-cent amounts:** If the value converts to less than `0.01 XLM` (but is non-zero), the formatting shows the amount in raw `stroops` (e.g., `50000 stroops`).
- **Standard amounts:** Standard amounts are formatted in `XLM` with two decimal places (e.g., `1.50 XLM`).
- **Zero amount:** A zero price formats to `0 XLM`.

## Document titles

The root layout keeps the home route on the default `AgentPay` title and applies the template `"%s — AgentPay"` to route-specific titles.

| Route                          | Title                      |
| ------------------------------ | -------------------------- |
| `/`                            | `AgentPay`                 |
| `/services`                    | `Services`                 |
| `/services/new`                | `New service`              |
| `/usage`                       | `Usage metering`           |
| `/agents`                      | `Agents`                   |
| `/admin`                       | `Admin`                    |
| `/stats`                       | `Stats`                    |
| `/events`                      | `Event log`                |
| `/webhooks`                    | `Webhooks`                 |
| `/api-keys`                    | `API keys`                 |
| `/search`                      | `Search`                   |
| `/services/[serviceId]`        | `Service {serviceId}`      |
| `/services/[serviceId]/edit`   | `Edit service {serviceId}` |
| `/services/[serviceId]/agents` | `Top agents {serviceId}`   |
| `/agents/[agent]`              | `Agent {agent}`            |

## Services list paging

The `/services` page now uses server-driven pagination with the shared `Spinner`, `EmptyState`, and `Pagination` components.

- Requests are sent as `GET /api/v1/services?page=N&limit=25`.
- The page assumes the backend returns a paged payload with `services` or `items`, plus `page` and `pageCount`.
- If the backend clamps an out-of-range request, the UI follows the server-provided `page` and `pageCount` so the visible indicator stays in sync.
- Service rows link through to `/services/:serviceId` using encoded IDs.

## Commands

| Command                 | Description                 |
| ----------------------- | --------------------------- | ----------------------------------- |
| `npm run build`         | Production build            |
| `npm test`              | Run Jest tests              |
| `npm run test:coverage` | Run Jest with coverage      | (not defined in this repo snapshot) |
| `npm run dev`           | Development server          |
| `npm run lint`          | Run ESLint                  |
| `npm run typecheck`     | Run the TypeScript compiler |

## CI/CD

On push/PR to `main`, GitHub Actions runs:

- `npm ci`
- `npm run build`
- `npm test`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor workflow, branch naming convention, local checks, and UI accessibility expectations.

## License

MIT
