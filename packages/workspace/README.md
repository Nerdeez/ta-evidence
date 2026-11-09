# @ta/workspace

## Exports

| API | Use |
|-----|-----|
| `findMonorepoRoot` | Walk up from a directory until `pnpm-workspace.yaml` |
| `requireMonorepoRoot` | Same, throws if not inside the workspace |
| `loadRepoDotenv` | Load root `.env` via `dotenv` (skips if missing) |
