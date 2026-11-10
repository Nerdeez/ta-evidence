import { type AuthUser, auth } from '@ta/auth/next';
import { headers } from 'next/headers.js';

import { cn } from '#utils';
import { Avatar, AvatarFallback } from '../avatar/avatar.js';
import { buttonVariants } from '../button/button.js';
import logoImport from './logo.svg';

function logoUrl(value: typeof logoImport): string {
  return typeof value === 'string' ? value : value.src;
}

const GITHUB_REPO_URL = 'https://github.com/Nerdeez/ta-evidence';
const SIGN_IN_PATH = '/login';
const SIGN_UP_PATH = '/signup';

function userInitials(name?: string | null, email?: string | null): string {
  const fromName = name?.trim();
  if (fromName) {
    const parts = fromName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const first = parts[0]?.[0] ?? '';
      const last = parts.at(-1)?.[0] ?? '';
      return `${first}${last}`.toUpperCase();
    }
    return fromName.slice(0, 2).toUpperCase();
  }

  const fromEmail = email?.trim();
  if (fromEmail) {
    const local = fromEmail.split('@')[0] ?? fromEmail;
    return local.slice(0, 2).toUpperCase();
  }

  return '?';
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function HeaderAuthActions({ user }: { user: AuthUser | null }) {
  if (user) {
    const label = user.name.trim() || user.email.trim() || 'Account';
    const initials = userInitials(user.name, user.email);

    return (
      <Avatar className="size-8" title={label} aria-label={label}>
        <AvatarFallback className="text-[0.65rem] font-semibold tracking-wide">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <a
        href={SIGN_IN_PATH}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'text-muted-foreground hover:text-foreground',
        )}
      >
        Sign in
      </a>
      <a href={SIGN_UP_PATH} className={buttonVariants({ size: 'sm' })}>
        Sign up
      </a>
    </div>
  );
}

/** Site header (Next.js server component). Session comes from Better Auth on the request. */
export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user ?? null;

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-6">
        <a href="/" className="inline-flex shrink-0 leading-none">
          <img
            src={logoUrl(logoImport)}
            alt="TA Evidence"
            width={124}
            height={26}
            className="block h-[26px] w-auto"
          />
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <HeaderAuthActions user={user} />
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View TA Evidence on GitHub"
            className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <GitHubIcon className="size-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
