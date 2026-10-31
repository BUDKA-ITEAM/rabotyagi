export default function Loading() {
  return (
    <div role="status" className="animate-pulse space-y-6">
      <div className="h-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <p className="text-center muted">Загружаем страницу…</p>
    </div>
  );
}
