import { strategies } from './catalog';
import { StrategyCard } from './strategy-card';

export function StrategyGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {strategies.map((strategy) => (
          <StrategyCard key={strategy.slug} {...strategy} />
        ))}
      </div>
    </section>
  );
}
