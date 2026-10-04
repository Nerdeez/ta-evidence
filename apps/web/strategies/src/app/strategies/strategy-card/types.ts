export type StrategyVerdict = 'negative' | 'positive' | 'weak' | 'inconclusive';

export type StrategyCardProps = {
  slug: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  /** Evidence score from 0 (poor efficacy) to 100 (strong efficacy). */
  score: number;
};

export type StrategyCatalogItem = StrategyCardProps;

export type StrategyEfficacyDisplay = {
  level: string;
  verdict: StrategyVerdict;
};
