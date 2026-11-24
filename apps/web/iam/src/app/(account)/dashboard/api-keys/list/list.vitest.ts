import type { DashboardApiKey } from '../utils';
import type { DeleteApiKeyResult } from './delete.action';

type DeleteMock = (keyId: DashboardApiKey['id']) => Promise<DeleteApiKeyResult>;

const defaultDeleteMock: DeleteMock = async () => ({
  ok: false,
  error: 'Delete is not available in component tests.',
});

let deleteMock: DeleteMock = defaultDeleteMock;

export function setDeleteApiKeyActionMock(mock: DeleteMock): void {
  deleteMock = mock;
}

export function resetDeleteApiKeyActionMock(): void {
  deleteMock = defaultDeleteMock;
}

export async function deleteApiKeyAction(
  keyId: DashboardApiKey['id'],
): Promise<DeleteApiKeyResult> {
  return deleteMock(keyId);
}

export function vitestPlugins() {
  return [
    {
      name: 'resolve-delete-api-key-action-mock',
      enforce: 'pre' as const,
      resolveId(source: string, importer?: string) {
        if (!importer) {
          return null;
        }
        const normalizedImporter = importer.replaceAll('\\', '/');
        if (!normalizedImporter.includes('/api-keys/list/')) {
          return null;
        }
        if (
          source !== './delete.action' &&
          !source.replaceAll('\\', '/').endsWith('/api-keys/list/delete.action')
        ) {
          return null;
        }
        const separator = importer.includes('\\') ? '\\' : '/';
        const dir = importer.slice(0, importer.lastIndexOf(separator) + 1);
        return `${dir}list.vitest.ts`;
      },
    },
  ];
}
