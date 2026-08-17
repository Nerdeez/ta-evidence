import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECURITY_MANIFEST } from '../src/manifest.js';
import type { DailyBarFixture } from '../src/types.js';

const TRADING_DAYS_PER_YEAR = 252;
/** Fixed end date so regenerated fixtures stay deterministic across machines. */
const FIXTURE_END_DATE = '2026-08-07';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const mocksRoot = resolve(packageDir, '..');
const outputDir = resolve(mocksRoot, 'data/daily-bars');

/** Representative starting prices for synthetic fixtures (not live market data). */
const BASE_PRICES: Record<string, number> = {
  AAPL: 220,
  MSFT: 415,
  GOOGL: 175,
  AMZN: 195,
  META: 520,
  NVDA: 125,
  TSLA: 245,
  JPM: 205,
  V: 280,
  JNJ: 155,
  WMT: 95,
  PG: 165,
  UNH: 520,
  HD: 380,
  DIS: 115,
  BAC: 42,
  XOM: 115,
  CVX: 155,
  PFE: 28,
  NKE: 78,
};

function seededRandom(seed: string): () => number {
  let state = 0;

  for (const char of seed) {
    state = Math.imul(31, state) + char.charCodeAt(0);
    state |= 0;
  }

  return () => {
    state = Math.imul(state ^ (state >>> 16), 2246822507);
    state = Math.imul(state ^ (state >>> 13), 3266489909);
    state ^= state >>> 16;
    return (state >>> 0) / 4294967296;
  };
}

function roundPrice(value: number): number {
  return Number(value.toFixed(4));
}

function generateTradingDates(count: number, endDate: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${endDate}T12:00:00Z`);

  while (dates.length < count) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      dates.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return dates.reverse();
}

function generateSyntheticBars(ticker: string, dates: string[]): DailyBarFixture[] {
  const random = seededRandom(ticker);
  let previousClose = BASE_PRICES[ticker] ?? 100;

  return dates.map((date) => {
    const overnightJitter = (random() - 0.5) * 0.002;
    const open = roundPrice(previousClose * (1 + overnightJitter));
    const intradayReturn = (random() - 0.5) * 0.04;
    const close = roundPrice(open * (1 + intradayReturn));
    const high = roundPrice(Math.max(open, close) * (1 + random() * 0.02));
    const low = roundPrice(Math.min(open, close) * (1 - random() * 0.02));
    const volume = Math.floor(5_000_000 + random() * 45_000_000);

    previousClose = close;

    return {
      date,
      open,
      high,
      low,
      close,
      adjusted_close: close,
      volume,
    };
  });
}

function writeBars(ticker: string, bars: DailyBarFixture[]): void {
  const filePath = resolve(outputDir, `${ticker}.json`);
  writeFileSync(filePath, `${JSON.stringify(bars, null, 2)}\n`);
}

function main(): void {
  const dates = generateTradingDates(TRADING_DAYS_PER_YEAR, FIXTURE_END_DATE);

  for (const security of SECURITY_MANIFEST) {
    const bars = generateSyntheticBars(security.ticker, dates);
    writeBars(security.ticker, bars);
    console.log(`Wrote ${bars.length} bars for ${security.ticker}`);
  }

  console.log(`Generated fixtures for ${SECURITY_MANIFEST.length} tickers in ${outputDir}`);
}

main();
