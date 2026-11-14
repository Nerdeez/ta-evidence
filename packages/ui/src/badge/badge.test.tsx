import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Badge } from './badge.js';

describe('Badge', () => {
  it('renders the badge label', async () => {
    const screen = await render(<Badge variant="secondary">Active</Badge>);

    await expect.element(screen.getByText('Active')).toBeVisible();
  });
});
