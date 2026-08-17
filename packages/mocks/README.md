# @ta/mocks

Fixture market data for local development, preview environments, and E2E tests.

## Contents

- **20 US equities** — mix of NASDAQ and NYSE large caps
- **~252 trading days** (~one year) of daily OHLCV bars per ticker
- **All tickers** use **deterministic synthetic** OHLCV on a shared trading calendar (for E2E only, not real market data)

## Usage

```typescript
import { getAllSecuritiesWithBars, getDailyBars, listTickers } from '@ta/mocks';

const tickers = listTickers(); // 20 symbols
const aaplBars = getDailyBars('AAPL');
const all = getAllSecuritiesWithBars();
```

## Regenerating fixtures

After editing `src/manifest.ts` or `scripts/generate-fixtures.ts`:

```bash
pnpm --filter @ta/mocks generate
```

## Layout

```text
packages/mocks/
├── data/daily-bars/     # Generated JSON per ticker (committed)
├── scripts/
│   └── generate-fixtures.ts
└── src/
    ├── manifest.ts     # Security metadata
    ├── index.ts        # Public API
    └── types.ts
```

## License

MIT — see [LICENSE](../../LICENSE). All fixture prices are synthetic and intended for testing only.
