# @ta/api-ticker

A free, open-source REST API for securities reference data and historical US equity bars, released under the [MIT License](../../../LICENSE).

This service is **not** a real-time API. Stock data is delayed and intended for research, analysis, and non–time-sensitive applications—not live trading or tick-by-tick quotes.

## Features

- Historical US equity market data over HTTP
- API key authentication with per-developer rate limits
- Built with [Fastify](https://fastify.dev/)
- Test and lint tooling for local development

## Authentication

Developers must register for an API key before calling the API. Registration and key management are handled through `@ta/web-iam`.

Send your API key on every request using the `Authorization` header with the Bearer scheme:

```http
Authorization: Bearer YOUR_API_KEY
```

Requests without a valid key are rejected.

## Rate limits

Each API key is subject to rate limits. Stay within your allotted quota to avoid `429 Too Many Requests` responses. Exact limits and usage details are shown in the developer portal for your account.

## Development

From the repository root:

```sh
pnpm exec turbo dev --filter=./apps/api/ticker
```

The dev server listens on port **3003** (so it does not clash with `@ta/web-strategies` on 3000). Health check: `GET /health` → `{ "status": "ok" }` (same as `@ta/api-strategies`).

## License

MIT — see [LICENSE](../../../LICENSE) in the repository root.
