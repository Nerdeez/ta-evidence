export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Research
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          TA Evidence
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Open, reproducible conclusions from financial markets research. This site will publish our
          findings as they are ready.
        </p>
      </main>
    </div>
  );
}
