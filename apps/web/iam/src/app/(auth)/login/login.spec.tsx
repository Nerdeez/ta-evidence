import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { LoginForm } from './login.form';

describe('LoginForm', () => {
  it('disables submit when the form is invalid', async () => {
    const screen = await render(<LoginForm />);

    await expect.element(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  });

  it('shows field errors and keeps submit disabled for invalid input', async () => {
    const screen = await render(<LoginForm />);
    const submit = screen.getByRole('button', { name: 'Sign in' });

    await screen.getByRole('textbox', { name: 'Email' }).fill('not-an-email');
    await screen.getByLabelText('Password').fill('short');

    await expect.element(screen.getByText('Please enter a valid email address.')).toBeVisible();
    await expect.element(screen.getByText('Password must be at least 8 characters.')).toBeVisible();
    await expect.element(submit).toBeDisabled();
  });

  it('enables submit when all fields are valid', async () => {
    const screen = await render(<LoginForm />);
    const submit = screen.getByRole('button', { name: 'Sign in' });

    await screen.getByRole('textbox', { name: 'Email' }).fill('jane@example.com');
    await screen.getByLabelText('Password').fill('password123');

    await expect.element(submit).toBeEnabled();
  });
});
