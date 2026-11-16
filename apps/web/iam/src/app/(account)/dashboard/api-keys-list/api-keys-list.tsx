'use client';

import { Badge } from '@ta/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ta/ui/table';
import { useSyncExternalStore } from 'react';

import {
  type DashboardApiKey,
  formatApiKeyDate,
  formatExpiry,
  formatLastUsed,
} from '../api-keys.utils';

export type ApiKeysListProps = {
  activeKeys: DashboardApiKey[];
  expiredKeys: DashboardApiKey[];
};

const subscribeNoop = () => () => {};

/** False during SSR and hydration, true afterwards. */
function useIsBrowser(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/** Dates depend on the viewer's locale and time zone, so they are rendered in the browser only. */
function BrowserOnlyText({ format }: { format: () => string }) {
  const isBrowser = useIsBrowser();
  return isBrowser ? format() : null;
}

function StatusBadge({ expired }: { expired: boolean }) {
  if (expired) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Expired
      </Badge>
    );
  }
  return <Badge variant="secondary">Active</Badge>;
}

function ApiKeyListSection({
  title,
  description,
  keys,
  expired = false,
}: {
  title: string;
  description?: string;
  keys: DashboardApiKey[];
  expired?: boolean;
}) {
  if (keys.length === 0) {
    return null;
  }

  const sectionId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <section className="space-y-3" aria-labelledby={sectionId}>
      <div>
        <h2 id={sectionId} className="text-lg font-medium tracking-tight">
          {title}
        </h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead>Expires</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((apiKey) => (
            <TableRow
              key={apiKey.id}
              className={expired ? 'text-muted-foreground opacity-80' : undefined}
            >
              <TableCell className="font-medium text-foreground">{apiKey.name}</TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {apiKey.maskedKey}
                </code>
              </TableCell>
              <TableCell>
                <StatusBadge expired={expired} />
              </TableCell>
              <TableCell>
                <BrowserOnlyText format={() => formatApiKeyDate(apiKey.createdAt)} />
              </TableCell>
              <TableCell>
                <BrowserOnlyText format={() => formatLastUsed(apiKey.lastUsedAt)} />
              </TableCell>
              <TableCell>
                <BrowserOnlyText format={() => formatExpiry(apiKey.expiresAt)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function ApiKeysList({ activeKeys, expiredKeys }: ApiKeysListProps) {
  const isEmpty = activeKeys.length === 0 && expiredKeys.length === 0;

  if (isEmpty) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        You have not created any API keys yet. Key creation will be available here soon.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <ApiKeyListSection title="Active keys" keys={activeKeys} />
      <ApiKeyListSection
        title="Expired keys"
        description="Expired keys are kept for your records. They no longer authenticate API requests."
        keys={expiredKeys}
        expired
      />
    </div>
  );
}
