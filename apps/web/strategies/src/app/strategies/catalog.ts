import type { StrategyCatalogItem } from './strategy-card/types';

export const strategies = [
  {
    slug: 'filling-the-gap',
    title: 'Filling the Gap',
    description: `<p>A stock gap is a significant price movement on a stock that occurs without any trading in between.</p>
<p>Many technical analysts claim that the majority of stock gaps are filled — some claim more than 70%, and we've heard some claim even more than 90% (guess it depends on how much of a believer in the strategy that specific TA is).</p>
<p>On this page we are going to analyze the data and determine once and for all if their claim is true or bullshit.</p>`,
    image: {
      src: '/strategies/filling-the-gap/card.svg',
      alt: 'Stock price chart with a gap between candlesticks',
    },
    score: 15,
  },
] satisfies StrategyCatalogItem[];
