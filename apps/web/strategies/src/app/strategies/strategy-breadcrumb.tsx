'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@ta/ui/breadcrumb';
import { HouseIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { strategies } from './catalog';

export function StrategyBreadcrumb() {
  const pathname = usePathname();
  const slug = pathname?.startsWith('/strategies/')
    ? pathname.slice('/strategies/'.length).split('/')[0]
    : '';
  const strategy = strategies.find((item) => item.slug === slug);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" aria-label="Home" />}>
            <HouseIcon className="size-4" />
            <span className="sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {strategy ? (
            <BreadcrumbLink render={<Link href="/" />}>Strategies</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Strategies</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {strategy ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{strategy.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
