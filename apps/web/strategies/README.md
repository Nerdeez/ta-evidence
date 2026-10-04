# @ta/web-strategies

Public Next.js site for strategy research and published conclusions.

This is a public facing site that does not need to register

## Development

From the repository root:

```sh
pnpm exec turbo dev --filter=./apps/web/strategies
```

Or from this directory:

```sh
pnpm dev
```

The dev server uses Turbopack (`next dev --turbopack`) and serves at [http://localhost:3000](http://localhost:3000).

## Build

```sh
pnpm build
pnpm start
```
