import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from './field.js';

describe('Field', () => {
  it('renders a labeled field with description', async () => {
    const screen = await render(
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input id="email" type="email" />
          <FieldDescription>We will never share your email.</FieldDescription>
        </Field>
      </FieldGroup>,
    );

    await expect.element(screen.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect
      .element(screen.getByText('We will never share your email.', { exact: true }))
      .toBeVisible();
  });

  it('renders a single validation error from errors', async () => {
    const screen = await render(
      <Field data-invalid={true}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldError errors={[{ message: 'Enter a valid email address.' }]} />
      </Field>,
    );

    await expect
      .element(screen.getByRole('alert'))
      .toHaveTextContent('Enter a valid email address.');
  });
});
