import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { SignUpForm } from './signup.form';

describe('SignUpForm', () => {
  it('disables submit when the form is invalid', async () => {
    const screen = await render(<SignUpForm />);

    await expect.element(screen.getByRole('button', { name: 'Create account' })).toBeDisabled();
  });

  it('shows field errors and keeps submit disabled for invalid input', async () => {
    const screen = await render(<SignUpForm />);
    const submit = screen.getByRole('button', { name: 'Create account' });

    await screen.getByRole('textbox', { name: 'Name' }).fill('Jane Doe');
    await screen.getByRole('textbox', { name: 'Email' }).fill('not-an-email');
    await screen.getByRole('textbox', { name: 'Password', exact: true }).fill('short');
    await screen.getByRole('textbox', { name: 'Confirm password' }).fill('other');

    await expect.element(screen.getByText('Please enter a valid email address.')).toBeVisible();
    await expect.element(screen.getByText('Password must be at least 8 characters.')).toBeVisible();
    await expect.element(screen.getByText('Passwords do not match.')).toBeVisible();
    await expect.element(submit).toBeDisabled();
  });

  it('enables submit when all fields are valid', async () => {
    const screen = await render(<SignUpForm />);
    const submit = screen.getByRole('button', { name: 'Create account' });

    await screen.getByRole('textbox', { name: 'Name' }).fill('Jane Doe');
    await screen.getByRole('textbox', { name: 'Email' }).fill('jane@example.com');
    await screen.getByRole('textbox', { name: 'Password', exact: true }).fill('password123');
    await screen.getByRole('textbox', { name: 'Confirm password' }).fill('password123');

    await expect.element(submit).toBeEnabled();
  });
});
