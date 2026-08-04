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
| `apps/web` | Main web application |
| `apps/docs` | Documentation site |
| `apps/market-data/api` | REST API for historical US stock market data |
| `apps/market-data/docs` | API documentation site |
| `apps/market-data/portal` | Developer portal — register, manage API keys, and access data |
| `packages/ui` (`@ta/ui`) | Shared React component library |
| `packages/typescript-config` (`@ta/typescript-config`) | Shared TypeScript configuration |

`market-data` is the first product under `apps/`. Each subfolder is a separate deployable app:

```
apps/market-data/
├── api/      # REST API
├── docs/     # API documentation
└── portal/   # Developer portal
```

## Development

Install dependencies:

```sh
pnpm install
```

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
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=docs
pnpm exec turbo dev --filter=./apps/market-data/api
pnpm exec turbo dev --filter=./apps/market-data/docs
pnpm exec turbo dev --filter=./apps/market-data/portal
```

## Contributing

Contributions are welcome. Research, data pipelines, API improvements, and documentation all help make open economic data more accessible.

## License

MIT — see [LICENSE](LICENSE) for details.
