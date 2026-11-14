import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table.js';

describe('Table', () => {
  it('renders column headers and a cell', async () => {
    const screen = await render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Production</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    await expect.element(screen.getByText('Name')).toBeVisible();
    await expect.element(screen.getByText('Status')).toBeVisible();
    await expect.element(screen.getByText('Production')).toBeVisible();
    await expect.element(screen.getByText('Active')).toBeVisible();
  });
});
