import Link from 'next/link';

export default function ForgotPasswordCheckEmailPage() {
  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
      <p className="text-sm text-muted-foreground">
        If an account exists for that address, we sent a password reset link. Open it to choose a
        new password.
      </p>
      <p className="text-sm">
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
