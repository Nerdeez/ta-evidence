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

export function formatLastUsed(date: Date | null): string {
  if (!date) {
    return 'Never';
  }
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);
  if (abs < 60) {
    return relativeTimeFormatter.format(diffSeconds, 'second');
  }
  if (abs < 3600) {
    return relativeTimeFormatter.format(Math.round(diffSeconds / 60), 'minute');
  }
  if (abs < 86_400) {
    return relativeTimeFormatter.format(Math.round(diffSeconds / 3600), 'hour');
  }
  if (abs < 2_592_000) {
    return relativeTimeFormatter.format(Math.round(diffSeconds / 86_400), 'day');
  }
  return formatApiKeyDate(date);
}

export function formatExpiry(date: Date | null): string {
  if (!date) {
    return 'Never';
  }
  return formatApiKeyDate(date);
}

export function isExpired(expiresAt: Date | null): boolean {
  return expiresAt !== null && expiresAt.getTime() < Date.now();
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