'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ta/ui/alert-dialog';
import { Badge } from '@ta/ui/badge';
import { Button } from '@ta/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ta/ui/table';
import { toast } from '@ta/ui/toast';
import { Loader2, Trash2 } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore, useTransition } from 'react';

import { type DashboardApiKey, formatApiKeyDate, formatExpiry, formatLastUsed } from '../utils';
import { type DeleteApiKeyResult, deleteApiKeyAction } from './delete.action';

const DELETE_API_KEY_SUCCESS_TITLE = 'API key deleted';
const DELETE_API_KEY_SUCCESS_DESCRIPTION =
  'Integrations using this key will no longer authenticate.';
const DELETE_API_KEY_FALLBACK_ERROR = 'Something went wrong.';

export { DELETE_API_KEY_SUCCESS_TITLE };

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
  onDeleteRequest,
}: {
  title: string;
  description?: string;
  keys: DashboardApiKey[];
  expired?: boolean;
  onDeleteRequest: (key: DashboardApiKey) => void;
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
            <TableHead className="w-12 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
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
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Delete ${apiKey.name}`}
                  onClick={() => onDeleteRequest(apiKey)}
                >
                  <Trash2 aria-hidden className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function ApiKeysList({
  activeKeys: initialActiveKeys,
  expiredKeys: initialExpiredKeys,
}: ApiKeysListProps) {
  const [activeKeys, setActiveKeys] = useState(initialActiveKeys);
  const [expiredKeys, setExpiredKeys] = useState(initialExpiredKeys);
  const [pendingDelete, setPendingDelete] = useState<DashboardApiKey | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setActiveKeys(initialActiveKeys);
    setExpiredKeys(initialExpiredKeys);
  }, [initialActiveKeys, initialExpiredKeys]);

  const removeKeyFromLists = (keyId: string) => {
    setActiveKeys((keys) => keys.filter((key) => key.id !== keyId));
    setExpiredKeys((keys) => keys.filter((key) => key.id !== keyId));
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) {
      return;
    }
    const { id } = pendingDelete;
    startTransition(async () => {
      let result: DeleteApiKeyResult;
      try {
        result = await deleteApiKeyAction(id);
      } catch {
        result = { ok: false, error: DELETE_API_KEY_FALLBACK_ERROR };
      }
      setPendingDelete(null);
      if (!result.ok) {
        toast.add({ type: 'error', title: result.error });
        return;
      }
      removeKeyFromLists(id);
      toast.add({
        type: 'success',
        title: DELETE_API_KEY_SUCCESS_TITLE,
        description: DELETE_API_KEY_SUCCESS_DESCRIPTION,
      });
    });
  };

  const isEmpty = activeKeys.length === 0 && expiredKeys.length === 0;

  if (isEmpty) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        You have not created any API keys yet. Key creation will be available here soon.
      </p>
    );
  }

  return (
    <>
      <DeleteApiKeyDialog
        pendingDelete={pendingDelete}
        isPending={isPending}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setPendingDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
      <div className="space-y-10">
        <ApiKeyListSection
          title="Active keys"
          keys={activeKeys}
          onDeleteRequest={setPendingDelete}
        />
        <ApiKeyListSection
          title="Expired keys"
          description="Expired keys are kept for your records. They no longer authenticate API requests."
          keys={expiredKeys}
          expired
          onDeleteRequest={setPendingDelete}
        />
      </div>
    </>
  );
}

function DeleteApiKeyDialog({
  pendingDelete,
  isPending,
  onOpenChange,
  onConfirm,
}: {
  pendingDelete: DashboardApiKey | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const open = pendingDelete !== null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete API key?</AlertDialogTitle>
          <AlertDialogDescription>
            {pendingDelete ? (
              <>
                <span className="font-medium text-foreground">{pendingDelete.name}</span>
                {` (`}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  {pendingDelete.maskedKey}
                </code>
                {`) will stop working immediately.`}
              </>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {isPending ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
