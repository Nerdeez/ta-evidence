import type { DashboardApiKey } from '../api-keys.utils';

type DeleteMock = (keyId: DashboardApiKey['id']) => Promise<void>;

let deleteMock: DeleteMock = async () => {
  throw new Error('Delete is not available in component tests.');
};

export function setDeleteApiKeyActionMock(mock: DeleteMock): void {
  deleteMock = mock;
}

export function resetDeleteApiKeyActionMock(): void {
  deleteMock = async () => {
    throw new Error('Delete is not available in component tests.');
  };
}

export async function deleteApiKeyAction(keyId: DashboardApiKey['id']): Promise<void> {
  return deleteMock(keyId);
}

export function vitestPlugins() {
  return [
    {
      name: 'resolve-delete-api-key-action-mock',
      enforce: 'pre' as const,
      resolveId(source: string, importer?: string) {
        if (!importer?.includes('api-keys-list')) {
          return null;
        }
        if (
          source !== './delete-api-key.action' &&
          !source.endsWith('/api-keys-list/delete-api-key.action')
        ) {
          return null;
        }
        const separator = importer.includes('\\') ? '\\' : '/';
        const dir = importer.slice(0, importer.lastIndexOf(separator) + 1);
        return `${dir}api-keys-list.vitest.ts`;
      },
    },
  ];
}
