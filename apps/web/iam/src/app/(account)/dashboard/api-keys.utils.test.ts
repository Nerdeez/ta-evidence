import { afterEach, describe, expect, it, vi } from 'vitest';

import { getMaxActiveApiKeys, isExpired, partitionDashboardApiKeys } from './api-keys.utils';

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
  });

  it('is false when expiry is missing or in the future', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01'));
    expect(isExpired(null)).toBe(false);
    expect(isExpired(new Date('2030-01-01'))).toBe(false);
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