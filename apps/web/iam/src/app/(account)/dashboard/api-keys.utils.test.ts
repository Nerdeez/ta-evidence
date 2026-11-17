import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  formatApiKeyDate,
  formatLastUsed,
  getMaxActiveApiKeys,
  isExpired,
  partitionDashboardApiKeys,
} from './api-keys.utils';

const envKey = 'IAM_MAX_ACTIVE_API_KEYS';

describe('getMaxActiveApiKeys', () => {
  afterEach(() => {
    delete process.env[envKey];
  });

  it('defaults to 5', () => {
    expect(getMaxActiveApiKeys()).toBe(5);
  });

  it('reads a valid override', () => {
    process.env[envKey] = '10';
    expect(getMaxActiveApiKeys()).toBe(10);
  });

  it('falls back when the override is invalid', () => {
    process.env[envKey] = '0';
    expect(getMaxActiveApiKeys()).toBe(5);
    process.env[envKey] = 'not-a-number';
    expect(getMaxActiveApiKeys()).toBe(5);
  });
});

describe('isExpired', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('is true when expiry is in the past', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
    expect(isExpired(new Date('2020-01-01'))).toBe(true);
    expect(isExpired('2020-01-01T00:00:00.000Z')).toBe(true);
  });

  it('is false when expiry is missing or in the future', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
    expect(isExpired(null)).toBe(false);
    expect(isExpired(new Date('2030-01-01'))).toBe(false);
  });
});

describe('formatLastUsed', () => {
  const now = new Date(2025, 5, 10, 9, 0);
  const relativeDays = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  it('returns Never when the key was never used', () => {
    expect(formatLastUsed(null, now)).toBe('Never');
  });

  it('uses calendar days rather than elapsed hours', () => {
    expect(formatLastUsed(new Date(2025, 5, 10, 0, 5), now)).toBe(relativeDays.format(0, 'day'));
    expect(formatLastUsed(new Date(2025, 5, 9, 23, 55), now)).toBe(relativeDays.format(-1, 'day'));
    expect(formatLastUsed(new Date(2025, 5, 3, 12, 0), now)).toBe(relativeDays.format(-7, 'day'));
  });

  it('falls back to an absolute date after 30 days', () => {
    const date = new Date(2025, 3, 1, 12, 0);
    expect(formatLastUsed(date, now)).toBe(formatApiKeyDate(date));
  });
});

describe('partitionDashboardApiKeys', () => {
  it('splits active and expired keys', () => {
    const keys = [
      {
        id: '1',
        name: 'a',
        maskedKey: 'x*****',
        createdAt: new Date(),
        lastUsedAt: null,
        expiresAt: null,
      },
      {
        id: '2',
        name: 'b',
        maskedKey: 'y*****',
        createdAt: new Date(),
        lastUsedAt: null,
        expiresAt: new Date('2020-01-01T00:00:00.000Z'),
      },
    ];
    expect(partitionDashboardApiKeys(keys)).toEqual({
      active: [keys[0]],
      expired: [keys[1]],
    });
  });
});
