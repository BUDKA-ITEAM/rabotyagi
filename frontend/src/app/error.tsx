"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="panel p-12 text-center">
      <h1 className="mb-3 text-2xl font-semibold">
        Не удалось загрузить страницу
      </h1>
      <p className="mb-6 muted">Проверьте подключение и попробуйте ещё раз.</p>
      <button className="primary" onClick={reset}>
        Повторить
      </button>
    </div>
  );
}
