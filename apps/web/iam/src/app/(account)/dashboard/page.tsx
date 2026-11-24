import { ApiKeysList, listDashboardApiKeys } from './api-keys/list';

export default async function DashboardPage() {
  const { active, expired } = await listDashboardApiKeys();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">API keys</h1>
        <p className="max-w-2xl text-muted-foreground">
          Manage keys for calling the TA Evidence API from your servers. Send each request with the{' '}
          <code className="rounded bg-muted px-1 font-mono text-sm">x-api-key</code> header.
        </p>
      </header>
      <ApiKeysList activeKeys={active} expiredKeys={expired} />
    </main>
  );
}
