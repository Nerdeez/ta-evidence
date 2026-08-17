export interface DailyBarFixture {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface SecurityFixture {
  ticker: string;
  exchange: string;
  name: string;
  currency: string;
  assetType: string;
}
