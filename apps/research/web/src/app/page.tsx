import { Hero } from './hero';
import { StrategyGrid } from './strategies/strategy-grid';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero />
      <StrategyGrid />
    </div>
  );
}
