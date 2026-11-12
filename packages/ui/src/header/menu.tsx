'use client';

import { createAuthClient } from 'better-auth/react';
import { KeyRound, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation.js';
import { useTransition } from 'react';
import { Avatar, AvatarFallback } from '../avatar/avatar.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu/dropdown-menu.js';
import { toast } from '../toast/toast.js';

const authClient = createAuthClient();

const SIGN_OUT_ERROR_MESSAGE = 'Could not sign out. Please try again.';

function notifySignOutError() {
  toast.add({
    type: 'error',
    title: 'Sign-out failed',
    description: SIGN_OUT_ERROR_MESSAGE,
  });
}

export type MenuProps = {
  label: string;
  initials: string;
  email?: string | undefined;
  /** Path to open after a successful sign-out. */
  redirect?: string;
  /** Path for the change-password menu item (web-iam). */
  changePasswordPath?: string;
};

export function Menu({
  label,
  initials,
  email,
  redirect = '/login',
  changePasswordPath = '/change-password',
}: MenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.assign(redirect);
            },
            onError: () => {
              notifySignOutError();
            },
          },
        });
      } catch {
        notifySignOutError();
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label={label}
        title={label}
        disabled={isPending}
        className="rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Avatar className="size-8">
          <AvatarFallback className="text-[0.65rem] font-semibold tracking-wide">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="truncate font-medium leading-none">{label}</span>
              {email ? (
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              ) : null}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => {
            router.push(changePasswordPath);
          }}
        >
          <KeyRound className="size-4" aria-hidden />
          Change password
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" disabled={isPending} onClick={handleSignOut}>
          <LogOut className="size-4" aria-hidden />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
