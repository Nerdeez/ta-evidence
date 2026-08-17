import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECURITY_MANIFEST } from './manifest.js';
import type { DailyBarFixture, SecurityFixture } from './types.js';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const dataDir = resolve(packageDir, '../data/daily-bars');

const barCache = new Map<string, DailyBarFixture[]>();

export { SECURITY_MANIFEST } from './manifest.js';
export type { DailyBarFixture, SecurityFixture } from './types.js';

export function listTickers(): string[] {
  return SECURITY_MANIFEST.map((security) => security.ticker);
}

export function getSecurity(ticker: string): SecurityFixture | undefined {
  return SECURITY_MANIFEST.find((security) => security.ticker === ticker);
}

export function getDailyBars(ticker: string): DailyBarFixture[] {
  const cached = barCache.get(ticker);
  if (cached) {
    return cached;
  }

  const filePath = resolve(dataDir, `${ticker}.json`);
  const bars = JSON.parse(readFileSync(filePath, 'utf8')) as DailyBarFixture[];
  barCache.set(ticker, bars);
  return bars;
}

export function getAllSecuritiesWithBars(): Array<{
  security: SecurityFixture;
  bars: DailyBarFixture[];
}> {
  return SECURITY_MANIFEST.map((security) => ({
    security,
    bars: getDailyBars(security.ticker),
  }));
}
