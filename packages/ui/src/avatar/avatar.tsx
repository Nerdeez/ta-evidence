import type { ComponentProps } from 'react';

import { cn } from '#utils';

function Avatar({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar"
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, alt = '', ...props }: ComponentProps<'img'>) {
  return (
    <img
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      alt={alt}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
