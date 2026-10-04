import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Hero } from './index';

describe('Hero', () => {
  it('renders the headline', async () => {
    const screen = await render(<Hero />);

    await expect.element(screen.getByRole('heading', { level: 1 })).toBeVisible();
    await expect.element(screen.getByText('actually work?')).toBeVisible();
  });
});
