import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Label } from '../label/label.js';
import { Checkbox } from './checkbox.js';

describe('Checkbox', () => {
  it('renders a labeled checkbox', async () => {
    const screen = await render(
      <div className="flex items-center gap-2">
        <Checkbox id="saved-key" defaultChecked />
        <Label htmlFor="saved-key">I saved this key somewhere safe</Label>
      </div>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'I saved this key somewhere safe' });
    await expect.element(checkbox).toBeVisible();
    await expect.element(checkbox).toBeChecked();
  });
});
