# TA Evidence

Open-source economic research and free APIs for economic data, released under the [MIT License](LICENSE).

This repository publishes research focused on financial markets—especially equities—and provides developer-friendly APIs so anyone can build on the same data we use in our work.

## What we do

- **Economic research** — Open, reproducible analysis of markets and the broader economy
- **Free data APIs** — MIT-licensed endpoints for economic and market data
- **Developer access** — Register for an API key and use the APIs freely within published rate limits

## Products

Deployable apps are grouped under `apps/web` (Next.js) and `apps/api` (Fastify). Package names follow `@ta/web-*` and `@ta/api-*`.

### Web

- **`@ta/web-strategies`** — Public site for strategy research and published conclusions (not a real-time trading product).
- **`@ta/web-iam`** — Sign-up, sign-in, and API key management; hosts Better Auth at `/api/auth/*`.

### API

Data is sourced from providers whose terms allow redistribution through free, open APIs. Our goal is to make high-quality market and strategy data accessible to researchers, students, and developers without paywalls or proprietary lock-in.

- **`@ta/api-ticker`** — Securities reference data and **historical** US equity bars—not live or real-time quotes. Planned: REST endpoints backed by `@ta/db`, API key authentication, and rate limits for registered developers.
- **`@ta/api-strategies`** — Strategy analytics (e.g. filling-the-gap). Endpoints are added incrementally; see `apps/api/strategies`.

## API access

1. Register for a developer account via `@ta/web-iam`
2. Create an API key
3. Call `@ta/api-ticker` or `@ta/api-strategies` within your rate limit

Open documentation and client examples will grow alongside each API. All API code and data pipelines in this repository are MIT licensed.

## Repository structure

### Apps and packages

| Path | Description |
| --- | --- |
| `apps/web/strategies` (`@ta/web-strategies`) | Public site — strategy research and published conclusions |
| `apps/web/iam` (`@ta/web-iam`) | Sign-in, account, and API key management |
| `apps/api/ticker` (`@ta/api-ticker`) | REST API for securities and company reference data |
| `apps/api/strategies` (`@ta/api-strategies`) | REST API for strategy analytics (e.g. filling-the-gap) |
| `packages/db` (`@ta/db`) | Database schema, migrations, and client |
| `packages/mocks` (`@ta/mocks`) | Fixture market data for dev and E2E |
| `packages/theme` (`@ta/theme`) | Shared design tokens and Tailwind theme CSS |
| `packages/tsconfig` (`@ta/tsconfig`) | Shared TypeScript configuration |

Deployable apps live under `apps/web` (Next.js) and `apps/api` (Fastify):

```
apps/
├── web/
│   ├── strategies/  # @ta/web-strategies
│   └── iam/         # @ta/web-iam
└── api/
    ├── ticker/      # @ta/api-ticker
    └── strategies/  # @ta/api-strategies
```

## Development

Install dependencies:

```sh
pnpm install
cp .env.example .env
```

Local PostgreSQL for development (Docker, port 15432):

```sh
pnpm db:setup   # start Postgres (run db:migrate after db:generate)
```

See [`packages/db/README.md`](packages/db/README.md) for schema and migration workflows.

Local dev ports (fixed in each app’s `package.json` or `src/main.ts`):

| App | Port |
| --- | --- |
| `@ta/web-strategies` | 3000 |
| `@ta/web-iam` | 3001 |
| `@ta/api-strategies` | 3002 |
| `@ta/api-ticker` | 3003 |

Run all apps in development:

```sh
pnpm dev
```

Build everything:

```sh
pnpm build
```

Lint and format:

```sh
pnpm lint
pnpm format
```

Run a specific app:

```sh
pnpm exec turbo dev --filter=./apps/web/strategies
pnpm exec turbo dev --filter=./apps/web/iam
pnpm exec turbo dev --filter=./apps/api/ticker
pnpm exec turbo dev --filter=./apps/api/strategies
```

## Data origin

Our goal is to create an open source MIT license data for stocks.
To achieve that we have to make sure that the source of our data arrives from a location that allows to take 
that data and distribute it in an open license

## Contributing

Contributions are welcome. Research, data pipelines, API improvements, and documentation all help make open economic data more accessible.

## License

MIT — see [LICENSE](LICENSE) for details.
