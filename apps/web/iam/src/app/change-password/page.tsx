import { auth } from '@ta/auth/next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ChangePasswordForm } from './change-password.form';

export default async function ChangePasswordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <ChangePasswordForm />
      </div>
    </main>
  );
}
