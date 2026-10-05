import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Input } from './input.js';

describe('Input', () => {
  it('renders a text input with an accessible label', async () => {
    const screen = await render(
      <>
        <label htmlFor="signup-email">Email</label>
        <Input id="signup-email" type="email" placeholder="m@example.com" />
      </>,
    );

    await expect
      .element(screen.getByRole('textbox', { name: 'Email' }))
      .toHaveAttribute('placeholder', 'm@example.com');
  });
});
