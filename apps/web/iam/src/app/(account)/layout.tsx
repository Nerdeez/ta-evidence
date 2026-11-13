import { requireSession } from '@ta/auth/next';
import type { ReactNode } from 'react';

export default async function AccountLayout({ children }: { children: ReactNode }) {
  await requireSession();
  return children;
}
