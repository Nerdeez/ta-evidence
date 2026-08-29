# TA Evidence

Open-source economic research and free APIs for economic data, released under the [MIT License](LICENSE).

This repository publishes research focused on financial markets—especially equities—and provides developer-friendly APIs so anyone can build on the same data we use in our work.

## What we do

- **Economic research** — Open, reproducible analysis of markets and the broader economy
- **Free data APIs** — MIT-licensed endpoints for economic and market data
- **Developer access** — Register for an API key and use the APIs freely within published rate limits

## Products

### market-data

The first API product in this repository. `market-data` provides **historical** US stock market data—not live or real-time quotes.

Data is sourced from providers whose terms allow redistribution through a free, open API. Our goal is to make high-quality historical market data accessible to researchers, students, and developers without paywalls or proprietary lock-in.

**Planned capabilities:**

- Historical prices and related market data for US equities
- REST API with API key authentication
- Free tier with rate limits for registered developers
- Open documentation and client examples

## API access

1. Register for a developer account
2. Create an API key
3. Call the API within your rate limit

API documentation and registration will be available as `market-data` launches. All API code and data pipelines in this repository are MIT licensed.

## Repository structure

### Apps and packages

| Path | Description |
| --- | --- |
| `apps/research/web` | Public research site — publish conclusions and findings |
| `apps/market-data/api` | REST API for historical US stock market data |
| `apps/market-data/docs` | API documentation site |
| `apps/market-data/portal` | Developer portal — register, manage API keys, and access data |
| `packages/db` (`@ta/db`) | Database schema, migrations, and client |
| `packages/mocks` (`@ta/mocks`) | Fixture market data for dev and E2E |
| `packages/theme` (`@ta/theme`) | Shared design tokens and Tailwind theme CSS |
| `packages/tsconfig` (`@ta/tsconfig`) | Shared TypeScript configuration |

Each product under `apps/` groups related deployable apps:

```
apps/
├── research/
│   └── web/  # Research conclusions site (Next.js)
└── market-data/
    ├── api/      # REST API
    ├── docs/     # API documentation
    └── portal/   # Developer portal
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
pnpm exec turbo dev --filter=./apps/research/web
pnpm exec turbo dev --filter=./apps/market-data/api
pnpm exec turbo dev --filter=./apps/market-data/docs
pnpm exec turbo dev --filter=./apps/market-data/portal
```

## Data origin

Our goal is to create an open source MIT license data for stocks.
To achieve that we have to make sure that the source of our data arrives from a location that allows to take 
that data and distribute it in an open license

## Contributing

Contributions are welcome. Research, data pipelines, API improvements, and documentation all help make open economic data more accessible.

## License

MIT — see [LICENSE](LICENSE) for details.
