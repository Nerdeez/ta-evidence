/**
 * API key row for the dashboard list (no secret).
 * `maskedKey` is computed on the server from `PublicApiKey` only — never mask in the client.
 */
export type DashboardApiKey = {
  id: string;
  name: string;
  /** Server-derived display fingerprint, e.g. `ta-gRf*****`. */
  maskedKey: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
};

const DEFAULT_MAX_ACTIVE_API_KEYS = 5;
const MAX_ACTIVE_API_KEYS_ENV = 'IAM_MAX_ACTIVE_API_KEYS';

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

/** Maximum active API keys per user (`IAM_MAX_ACTIVE_API_KEYS`, default 5). */
export function getMaxActiveApiKeys(): number {
  const raw = process.env[MAX_ACTIVE_API_KEYS_ENV]?.trim();
  if (!raw) {
    return DEFAULT_MAX_ACTIVE_API_KEYS;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_MAX_ACTIVE_API_KEYS;
  }
  return parsed;
}

export function formatApiKeyDate(date: Date): string {
  return dateTimeFormatter.format(date);
}

const MAX_RELATIVE_DAYS = 30;

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Day-resolution relative label ("today", "yesterday", "3 days ago") in the runtime's time zone.
 * Depends on the viewer's time zone, so render it in the browser only.
 */
export function formatLastUsed(date: Date | null, now: Date = new Date()): string {
  if (!date) {
    return 'Never';
  }
  const diffDays = Math.round((startOfLocalDay(date) - startOfLocalDay(now)) / 86_400_000);
  if (Math.abs(diffDays) > MAX_RELATIVE_DAYS) {
    return formatApiKeyDate(date);
  }
  return relativeTimeFormatter.format(diffDays, 'day');
}

export function formatExpiry(date: Date | null): string {
  if (!date) {
    return 'Never';
  }
  return formatApiKeyDate(date);
}

/** Normalize Better Auth / JSON date fields for comparisons and formatting. */
export function asApiKeyDate(value: Date | string | null | undefined): Date | null {
  if (value == null) {
    return null;
  }
  return value instanceof Date ? value : new Date(value);
}

export function isExpired(expiresAt: Date | string | null): boolean {
  const expiry = asApiKeyDate(expiresAt);
  return expiry !== null && expiry.getTime() < Date.now();
}

export function partitionDashboardApiKeys(keys: DashboardApiKey[]): {
  active: DashboardApiKey[];
  expired: DashboardApiKey[];
} {
  const active: DashboardApiKey[] = [];
  const expired: DashboardApiKey[] = [];
  for (const key of keys) {
    if (isExpired(key.expiresAt)) {
      expired.push(key);
    } else {
      active.push(key);
    }
  }
  return { active, expired };
}
