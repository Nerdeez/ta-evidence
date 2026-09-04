import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { strategies } from '../catalog';
import { StrategyCard } from './index';

describe('StrategyCard', () => {
  it('renders the filling the gap strategy', async () => {
    const gapStrategy = strategies.find((strategy) => strategy.slug === 'filling-the-gap');
    if (!gapStrategy) {
      throw new Error('Expected filling-the-gap strategy in catalog');
    }

    const screen = await render(<StrategyCard {...gapStrategy} />);

    await expect
      .element(screen.getByRole('heading', { level: 3, name: 'Filling the Gap' }))
      .toBeVisible();
    const cardImage = screen.getByRole('img', { name: gapStrategy.image.alt });
    await expect.element(cardImage).toBeVisible();
    await expect
      .poll(() => {
        const image = cardImage.element();
        return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
      })
      .toBe(true);
    await expect.element(screen.getByText('Efficacy Level:')).toBeVisible();
    await expect.element(screen.getByTestId('efficacy-badge')).toHaveTextContent('Poor');
    await expect.element(screen.getByTestId('strategy-description')).toHaveClass('max-h-24');
    await expect.element(screen.getByTestId('read-more-button')).toHaveTextContent('Read more');
    await screen.getByTestId('read-more-button').click();
    await expect.element(screen.getByTestId('read-more-button')).toHaveTextContent('Read less');
    await expect
      .element(screen.getByRole('link', { name: /view evidence/i }))
      .toHaveAttribute('href', '/strategies/filling-the-gap');
    await expect
      .element(screen.getByText(/stock gap is a significant price movement/i))
      .toBeVisible();
  });
});
