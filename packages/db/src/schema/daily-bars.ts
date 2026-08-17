import { bigint, date, numeric, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { securities } from './securities.js';

export const dailyBars = pgTable(
  'daily_bars',
  {
    securityId: bigint('security_id', { mode: 'number' })
      .notNull()
      .references(() => securities.id),
    date: date('date').notNull(),
    open: numeric('open', { precision: 18, scale: 6 }).notNull(),
    high: numeric('high', { precision: 18, scale: 6 }).notNull(),
    low: numeric('low', { precision: 18, scale: 6 }).notNull(),
    close: numeric('close', { precision: 18, scale: 6 }).notNull(),
    adjustedClose: numeric('adjusted_close', { precision: 18, scale: 6 }).notNull(),
    volume: bigint('volume', { mode: 'number' }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.securityId, table.date] })],
);
