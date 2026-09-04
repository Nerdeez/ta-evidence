import type { StrategyEfficacyDisplay, StrategyVerdict } from './types';

export const verdictClassName: Record<StrategyVerdict, string> = {
  negative: 'bg-verdict-negative text-verdict-negative-foreground',
  weak: 'bg-verdict-weak text-verdict-weak-foreground',
  inconclusive: 'bg-verdict-inconclusive text-verdict-inconclusive-foreground',
  positive: 'bg-verdict-positive text-verdict-positive-foreground',
};

export function getStrategyHref(slug: string): string {
  return `/strategies/${slug}`;
}

export function getEfficacyFromScore(score: number): StrategyEfficacyDisplay {
  const normalized = Math.min(100, Math.max(0, score));

  if (normalized <= 24) {
    return { level: 'Poor', verdict: 'negative' };
  }

  if (normalized <= 49) {
    return { level: 'Weak', verdict: 'weak' };
  }

  if (normalized <= 74) {
    return { level: 'Mixed', verdict: 'inconclusive' };
  }

  return { level: 'Strong', verdict: 'positive' };
}
