'use client';

import { Button } from '@ta/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ta/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ta/ui/field';
import { Input } from '@ta/ui/input';
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';

import { loginAction } from './login.action';
import { loginSchema } from './login.schema';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onMount: loginSchema,
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      setFormError(null);
      startTransition(async () => {
        const result = await loginAction(value);
        setFormError(result.message);
      });
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and password to access TA Evidence.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
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
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      id="login-email"
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
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      id="login-password"
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      autoComplete="current-password"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
            <p className="text-right text-sm">
              <Link
                href="/forgot-password"
                className="text-muted-foreground underline underline-offset-4"
              >
                Forgot your password?
              </Link>
            </p>
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
              form="login-form"
              className="w-full"
              disabled={!canSubmit || isPending}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : 'Sign in'}
            </Button>
          )}
        </form.Subscribe>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-foreground underline underline-offset-4">
            Create account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
