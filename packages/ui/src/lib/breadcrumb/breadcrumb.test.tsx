import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js';

describe('Breadcrumb', () => {
  it('renders a breadcrumb trail with links and the current page', async () => {
    const screen = await render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/strategies">Strategies</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Filling the Gap</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    await expect.element(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeVisible();
    await expect.element(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    await expect
      .element(screen.getByRole('link', { name: 'Strategies' }))
      .toHaveAttribute('href', '/strategies');
    await expect
      .element(screen.getByText('Filling the Gap'))
      .toHaveAttribute('aria-current', 'page');
  });
});
