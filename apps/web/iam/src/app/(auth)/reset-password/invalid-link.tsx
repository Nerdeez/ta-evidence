import { buttonVariants } from '@ta/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@ta/ui/card';
import Link from 'next/link';

export function InvalidLink() {
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Reset link expired</CardTitle>
        <CardDescription>
          This password reset link is invalid or has expired. Request a new link and try again.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-4">
        <Link href="/forgot-password" className={buttonVariants({ className: 'w-full' })}>
          Request a new link
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
