import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ForgotPasswordForm } from './forgot-password.form';

describe('ForgotPasswordForm', () => {
  it('disables submit when the form is invalid', async () => {
    const screen = await render(<ForgotPasswordForm />);

    await expect.element(screen.getByRole('button', { name: 'Send reset link' })).toBeDisabled();
  });

  it('shows field errors and keeps submit disabled for invalid input', async () => {
    const screen = await render(<ForgotPasswordForm />);
    const submit = screen.getByRole('button', { name: 'Send reset link' });

    await screen.getByRole('textbox', { name: 'Email' }).fill('not-an-email');

    await expect.element(screen.getByText('Please enter a valid email address.')).toBeVisible();
    await expect.element(submit).toBeDisabled();
  });

  it('enables submit when the email is valid', async () => {
    const screen = await render(<ForgotPasswordForm />);
    const submit = screen.getByRole('button', { name: 'Send reset link' });

    await screen.getByRole('textbox', { name: 'Email' }).fill('jane@example.com');

    await expect.element(submit).toBeEnabled();
  });

  it('shows a form error when the reset request fails', async () => {
    const screen = await render(<ForgotPasswordForm />);
    const submit = screen.getByRole('button', { name: 'Send reset link' });

    await screen.getByRole('textbox', { name: 'Email' }).fill('jane@example.com');
    await submit.click();

    await expect
      .element(screen.getByRole('alert'))
      .toHaveTextContent('Password reset is not available in component tests.');
  });
});
