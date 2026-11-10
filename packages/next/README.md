# @ta/next

Shared Next.js setup for TA Evidence web apps (`apps/web/*`).

## Exports

| API | Use |
|-----|-----|
| `createNextConfig` | Load repo-root `.env*` when present (local dev), then return your `NextConfig` |

## Usage

```ts
import { createNextConfig } from '@ta/next';

export default createNextConfig();
// Optional: export default createNextConfig({ transpilePackages: ['@ta/other'] });
```
