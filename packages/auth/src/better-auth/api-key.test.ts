import { describe, expect, it } from 'vitest';

import { formatMaskedApiKeyDisplay } from './api-key.js';

describe('formatMaskedApiKeyDisplay', () => {
  it('appends asterisks to the visible start segment', () => {
    expect(formatMaskedApiKeyDisplay('ta-gRf', 'ta')).toBe('ta-gRf*****');
  });

  it('falls back to prefix when start is missing', () => {
    expect(formatMaskedApiKeyDisplay(null, 'ta_live')).toBe('ta_live*****');
  });

  it('falls back to prefix when start is blank', () => {
    expect(formatMaskedApiKeyDisplay('', 'ta_live')).toBe('ta_live*****');
    expect(formatMaskedApiKeyDisplay('   ', 'ta_live')).toBe('ta_live*****');
  });

  it('returns only asterisks when nothing is available', () => {
    expect(formatMaskedApiKeyDisplay(null, null)).toBe('*****');
  });

  it('does not double-mask values that already contain asterisks', () => {
    expect(formatMaskedApiKeyDisplay('ta-gRf*****', 'ta')).toBe('ta-gRf*****');
  });
});