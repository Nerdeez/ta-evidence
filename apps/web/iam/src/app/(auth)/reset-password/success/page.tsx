import Link from 'next/link';

export default function ResetPasswordSuccessPage() {
  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Password updated</h1>
      <p className="text-sm text-muted-foreground">
        Your password has been changed. Sign in with your new password to continue.
      </p>
      <p className="text-sm">
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
