'use client';

import { Button } from '@ta/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ta/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ta/ui/field';
import { Input } from '@ta/ui/input';
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { forgotPasswordAction } from './forgot-password.action';
import { forgotPasswordSchema } from './forgot-password.schema';

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onMount: forgotPasswordSchema,
      onChange: forgotPasswordSchema,
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      setFormError(null);
      startTransition(async () => {
        const result = await forgotPasswordAction(value);
        setFormError(result.message);
      });
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="forgot-password-form"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="forgot-password-email">Email</FieldLabel>
                    <Input
                      id="forgot-password-email"
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      autoComplete="email"
                      aria-invalid={isInvalid}
                      placeholder="m@example.com"
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
              form="forgot-password-form"
              className="w-full"
              disabled={!canSubmit || isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                'Send reset link'
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
