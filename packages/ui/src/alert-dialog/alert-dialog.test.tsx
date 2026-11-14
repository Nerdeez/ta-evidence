import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog.js';

describe('AlertDialog', () => {
  it('renders the confirmation message when open', async () => {
    const screen = await render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API key?</AlertDialogTitle>
            <AlertDialogDescription>
              Integrations using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    await expect.element(screen.getByRole('alertdialog')).toBeVisible();
    await expect.element(screen.getByText('Delete API key?')).toBeVisible();
    await expect
      .element(screen.getByText('Integrations using this key will stop working.'))
      .toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'Delete' })).toBeVisible();
  });
});
