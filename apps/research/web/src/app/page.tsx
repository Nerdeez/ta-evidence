export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <main className="flex w-full max-w-2xl flex-col gap-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Research
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">TA Evidence</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Open, reproducible conclusions from financial markets research. This site will publish our
          findings as they are ready.
        </p>
      </main>
    </div>
  );
}
