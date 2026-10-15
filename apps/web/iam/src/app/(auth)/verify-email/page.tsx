import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
      <p className="text-sm text-muted-foreground">
        We sent a verification link to your inbox. Open it to activate your account, then you can
        sign in.
      </p>
      <p className="text-sm">
        <Link href="/login" className="text-foreground underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
