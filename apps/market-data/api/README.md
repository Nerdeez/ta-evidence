# market-data API

A free, open-source REST API for historical US stock market data, released under the [MIT License](../../../LICENSE).

This service is **not** a real-time API. Stock data is delayed and intended for research, analysis, and non–time-sensitive applications—not live trading or tick-by-tick quotes.

## Features

- Historical US equity market data over HTTP
- API key authentication with per-developer rate limits
- Built with [Fastify](https://fastify.dev/)
- Test and lint tooling for local development

## Authentication

Developers must register for an API key before calling the API. Registration and key management are handled through the [market-data developer portal](../portal).

Send your API key on every request using the `Authorization` header with the Bearer scheme:

```http
Authorization: Bearer YOUR_API_KEY
```

Requests without a valid key are rejected.

## Rate limits

Each API key is subject to rate limits. Stay within your allotted quota to avoid `429 Too Many Requests` responses. Exact limits and usage details are shown in the developer portal for your account.

## Development

### Prerequisites

- Node.js (see the repository root for the supported version)
- npm

### Install

From the repository root:

```bash
npm install
```

### Run locally

```bash
npm run dev --workspace=apps/market-data/api
```

### Test

```bash
npm test --workspace=apps/market-data/api
```

### Lint

```bash
npm run lint --workspace=apps/market-data/api
```

## License

MIT — see [LICENSE](../../../LICENSE) in the repository root.
