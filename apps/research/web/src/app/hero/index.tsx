import { HeroIllustration } from './illustration';

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl lg:leading-tight">
            Does technical analysis <span className="text-primary">actually work?</span>
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            We test popular technical analysis patterns and indicators empirically across historical
            market data.
          </p>
        </div>

        <div className="hidden lg:block">
          <HeroIllustration className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
