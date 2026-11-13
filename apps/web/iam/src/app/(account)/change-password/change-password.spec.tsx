import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ChangePasswordForm } from './change-password.form';

describe('ChangePasswordForm', () => {
  it('disables submit when the form is invalid', async () => {
    const screen = await render(<ChangePasswordForm />);

    await expect.element(screen.getByRole('button', { name: 'Update password' })).toBeDisabled();
  });

  it('shows field errors and keeps submit disabled for invalid input', async () => {
    const screen = await render(<ChangePasswordForm />);
    const submit = screen.getByRole('button', { name: 'Update password' });

    await screen.getByRole('textbox', { name: 'Current password' }).fill('oldpass');
    await screen.getByRole('textbox', { name: 'New password', exact: true }).fill('short');
    await screen.getByRole('textbox', { name: 'Confirm new password' }).fill('other');

    await expect.element(screen.getByText('Password must be at least 8 characters.')).toBeVisible();
    await expect.element(screen.getByText('Passwords do not match.')).toBeVisible();
    await expect.element(submit).toBeDisabled();
  });

  it('enables submit when all fields are valid', async () => {
    const screen = await render(<ChangePasswordForm />);
    const submit = screen.getByRole('button', { name: 'Update password' });

    await screen.getByRole('textbox', { name: 'Current password' }).fill('oldpassword');
    await screen.getByRole('textbox', { name: 'New password', exact: true }).fill('password123');
    await screen.getByRole('textbox', { name: 'Confirm new password' }).fill('password123');

    await expect.element(submit).toBeEnabled();
  });

  it('shows a form error when the change request fails', async () => {
    const screen = await render(<ChangePasswordForm />);
    const submit = screen.getByRole('button', { name: 'Update password' });

    await screen.getByRole('textbox', { name: 'Current password' }).fill('oldpassword');
    await screen.getByRole('textbox', { name: 'New password', exact: true }).fill('password123');
    await screen.getByRole('textbox', { name: 'Confirm new password' }).fill('password123');
    await submit.click();

    await expect
      .element(screen.getByRole('alert'))
      .toHaveTextContent('Change password is not available in component tests.');
  });
});
