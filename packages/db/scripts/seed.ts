import { getAllSecuritiesWithBars } from '@ta/mocks';
import { and, eq } from 'drizzle-orm';
import { closeDb, db } from '../src/client.js';
import { dailyBars } from '../src/schema/daily-bars.js';
import { securities } from '../src/schema/securities.js';

const BATCH_SIZE = 500;

function toNumeric(value: number): string {
  return value.toString();
}

async function upsertSecurity(security: {
  ticker: string;
  exchange: string;
  name: string;
  currency: string;
  assetType: string;
}): Promise<number> {
  await db
    .insert(securities)
    .values({
      ticker: security.ticker,
      exchange: security.exchange,
      name: security.name,
      currency: security.currency,
      assetType: security.assetType,
      isActive: true,
    })
    .onConflictDoNothing();

  const [row] = await db
    .select({ id: securities.id })
    .from(securities)
    .where(and(eq(securities.ticker, security.ticker), eq(securities.exchange, security.exchange)));

  if (!row) {
    throw new Error(`Failed to resolve ${security.ticker} security row`);
  }

  return row.id;
}

async function seedDailyBars(
  securityId: number,
  bars: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjusted_close: number;
    volume: number;
  }>,
): Promise<void> {
  await db.delete(dailyBars).where(eq(dailyBars.securityId, securityId));

  for (let index = 0; index < bars.length; index += BATCH_SIZE) {
    const batch = bars.slice(index, index + BATCH_SIZE).map((bar) => ({
      securityId,
      date: bar.date,
      open: toNumeric(bar.open),
      high: toNumeric(bar.high),
      low: toNumeric(bar.low),
      close: toNumeric(bar.close),
      adjustedClose: toNumeric(bar.adjusted_close),
      volume: bar.volume,
    }));

    await db.insert(dailyBars).values(batch);
  }
}

async function main(): Promise<void> {
  const fixtures = getAllSecuritiesWithBars();
  let totalBars = 0;

  for (const { security, bars } of fixtures) {
    const securityId = await upsertSecurity(security);
    await seedDailyBars(securityId, bars);
    totalBars += bars.length;
    console.log(
      `Seeded ${bars.length} daily bars for ${security.ticker} (security_id=${securityId})`,
    );
  }

  console.log(`Seed complete: ${fixtures.length} securities, ${totalBars} daily bars.`);
}

try {
  await main();
} finally {
  await closeDb();
}
