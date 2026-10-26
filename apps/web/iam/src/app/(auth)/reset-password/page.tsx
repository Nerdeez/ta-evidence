import { InvalidLink } from './invalid-link';
import { ResetPasswordForm } from './reset-password.form';

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

  if (error === 'INVALID_TOKEN' || !token) {
    return <InvalidLink />;
  }

  return <ResetPasswordForm token={token} />;
}
