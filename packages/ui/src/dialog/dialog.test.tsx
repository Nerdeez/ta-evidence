import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog.js';

describe('Dialog', () => {
  it('renders the title when open', async () => {
    const screen = await render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    await expect.element(screen.getByRole('dialog')).toBeVisible();
    await expect.element(screen.getByText('Create API key')).toBeVisible();
  });
});
