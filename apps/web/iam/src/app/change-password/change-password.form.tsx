'use client';

import { Button } from '@ta/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ta/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ta/ui/field';
import { Input } from '@ta/ui/input';
import { toast } from '@ta/ui/toast';
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { changePasswordAction } from './change-password.action';
import { changePasswordSchema } from './change-password.schema';

const PASSWORD_UPDATED_TITLE = 'Password updated';
const PASSWORD_UPDATED_DESCRIPTION = 'Your password has been changed successfully.';

export function ChangePasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
    },
    validators: {
      onMount: changePasswordSchema,
      onChange: changePasswordSchema,
      onSubmit: changePasswordSchema,
    },
    onSubmit: ({ value }) => {
      setFormError(null);
      startTransition(async () => {
        const result = await changePasswordAction(value);
        if ('success' in result) {
          toast.add({
            type: 'success',
            title: PASSWORD_UPDATED_TITLE,
            description: PASSWORD_UPDATED_DESCRIPTION,
          });
          router.push('/dashboard');
          return;
        }
        setFormError(result.message);
      });
    },
  });

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Enter your current password and choose a new one.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="change-password-form"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="currentPassword"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="change-password-current">Current password</FieldLabel>
                    <Input
                      id="change-password-current"
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
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="change-password-new">New password</FieldLabel>
                    <Input
                      id="change-password-new"
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
                    <FieldLabel htmlFor="change-password-confirmation">Confirm new password</FieldLabel>
                    <Input
                      id="change-password-confirmation"
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
              form="change-password-form"
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
          <Link href="/dashboard" className="text-foreground underline underline-offset-4">
            Back to dashboard
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
