'use client';

import { Button } from '@ta/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ta/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ta/ui/field';
import { Input } from '@ta/ui/input';
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { resetPasswordAction } from './reset-password.action';
import { resetPasswordSchema } from './reset-password.schema';

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      token,
      password: '',
      passwordConfirmation: '',
    },
    validators: {
      onMount: resetPasswordSchema,
      onChange: resetPasswordSchema,
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      setFormError(null);
      startTransition(async () => {
        const result = await resetPasswordAction(value);
        setFormError(result.message);
      });
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="reset-password-form"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="reset-password-password">New password</FieldLabel>
                    <Input
                      id="reset-password-password"
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      autoComplete="new-password"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <form.Field
              name="passwordConfirmation"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="reset-password-confirmation">Confirm password</FieldLabel>
                    <Input
                      id="reset-password-confirmation"
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      autoComplete="new-password"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          {formError && (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button
              type="submit"
              form="reset-password-form"
              className="w-full"
              disabled={!canSubmit || isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                'Update password'
              )}
            </Button>
          )}
        </form.Subscribe>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
