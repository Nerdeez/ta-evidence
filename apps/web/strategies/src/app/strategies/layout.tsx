import type { ReactNode } from 'react';

import { StrategyBreadcrumb } from './strategy-breadcrumb';

export default function StrategiesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <StrategyBreadcrumb />
      {children}
    </div>
  );
}
