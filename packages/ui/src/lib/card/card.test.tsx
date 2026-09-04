import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Card, CardHeader, CardTitle } from './card.js';

describe('Card', () => {
  it('renders the card title', async () => {
    const screen = await render(
      <Card>
        <CardHeader>
          <CardTitle>Head and Shoulders</CardTitle>
        </CardHeader>
      </Card>,
    );

    await expect.element(screen.getByRole('heading', { level: 3, name: 'Head and Shoulders' })).toBeVisible();
  });
});
