import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ResetPasswordForm } from './reset-password.form';

const testToken = 'test-reset-token';

describe('ResetPasswordForm', () => {
  it('disables submit when the form is invalid', async () => {
    const screen = await render(<ResetPasswordForm token={testToken} />);

    await expect.element(screen.getByRole('button', { name: 'Update password' })).toBeDisabled();
  });

  it('shows field errors and keeps submit disabled for invalid input', async () => {
    const screen = await render(<ResetPasswordForm token={testToken} />);
    const submit = screen.getByRole('button', { name: 'Update password' });

    await screen.getByRole('textbox', { name: 'New password' }).fill('short');
    await screen.getByRole('textbox', { name: 'Confirm password' }).fill('other');

    await expect.element(screen.getByText('Password must be at least 8 characters.')).toBeVisible();
    await expect.element(screen.getByText('Passwords do not match.')).toBeVisible();
    await expect.element(submit).toBeDisabled();
  });

  it('enables submit when passwords match and meet requirements', async () => {
    const screen = await render(<ResetPasswordForm token={testToken} />);
    const submit = screen.getByRole('button', { name: 'Update password' });

    await screen.getByRole('textbox', { name: 'New password' }).fill('password123');
    await screen.getByRole('textbox', { name: 'Confirm password' }).fill('password123');

    await expect.element(submit).toBeEnabled();
  });

  it('shows a form error when the reset request fails', async () => {
    const screen = await render(<ResetPasswordForm token={testToken} />);
    const submit = screen.getByRole('button', { name: 'Update password' });

    await screen.getByRole('textbox', { name: 'New password' }).fill('password123');
    await screen.getByRole('textbox', { name: 'Confirm password' }).fill('password123');
    await submit.click();

    await expect
      .element(screen.getByRole('alert'))
      .toHaveTextContent('Password reset is not available in component tests.');
  });
});
