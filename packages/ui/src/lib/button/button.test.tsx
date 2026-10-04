import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Button } from './button.js';

describe('Button', () => {
  it('renders a button with the given label', async () => {
    const screen = await render(<Button type="button">Create account</Button>);

    await expect.element(screen.getByRole('button', { name: 'Create account' })).toBeVisible();
  });
});
