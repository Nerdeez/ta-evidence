# @ta/research-web

Public Next.js site for publishing TA Evidence research conclusions.

## Development

From the repository root:

```sh
pnpm exec turbo dev --filter=./apps/research/web
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
