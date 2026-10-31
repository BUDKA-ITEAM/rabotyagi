import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-sm muted">404</p>
      <h1 className="my-5 text-3xl font-semibold">Страница не найдена</h1>
      <Link href="/" className="primary">
        В каталог
      </Link>
    </div>
  );
}
