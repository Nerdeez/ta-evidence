import {
  bigserial,
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const securities = pgTable(
  'securities',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    ticker: varchar('ticker', { length: 16 }).notNull(),
    exchange: varchar('exchange', { length: 16 }).notNull(),
    name: text('name'),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    assetType: varchar('asset_type', { length: 16 }).notNull().default('equity'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('securities_ticker_exchange_uidx').on(table.ticker, table.exchange)],
);
