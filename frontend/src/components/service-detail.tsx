"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { repository } from "@/lib/api";
import { useUI } from "@/lib/store";
import { priceLabel } from "./service-card";
import { QueryState } from "@/components/ui";
export function ServiceDetail({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => repository.services(),
  });
  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: () => repository.profiles(),
  });
  const setChat = useUI((s) => s.setChatPeer);
  if (query.isPending || query.error)
    return <QueryState error={query.error} retry={() => query.refetch()} />;
  const service = query.data?.find((item) => item.id === id);
  if (!service)
    return (
      <p>
        Услуга не найдена. <Link href="/">Вернуться в каталог</Link>
      </p>
    );
  const owner = profiles.data?.find((item) => item.id === service.ownerId);
  return (
    <>
      <Link href="/" className="text-sm muted">
        ← Все услуги
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <article className="panel overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="max-h-96 w-full object-cover"
          />
          <div className="p-7">
            <p className="text-xs text-emerald-700">
              {service.category} · {service.location}
            </p>
            <h1 className="mt-3 text-3xl font-semibold">{service.title}</h1>
            <h2 className="mb-3 mt-8 text-lg font-semibold">Об услуге</h2>
            <p className="whitespace-pre-wrap leading-7 muted">
              {service.description}
            </p>
          </div>
        </article>
        <aside className="panel h-fit p-6">
          <p className="text-2xl font-bold">{priceLabel(service)}</p>
          <p className="mt-2 text-sm muted">
            Детали и время обсудите с исполнителем
          </p>
          <Link
            href={`/profiles/${service.ownerId}`}
            className="my-6 block border-y border-zinc-200 py-5 dark:border-zinc-700"
          >
            <p className="font-semibold">{owner?.name || "Исполнитель"}</p>
            <p className="mt-1 text-xs muted">Открыть профиль →</p>
          </Link>
          <button
            className="primary w-full"
            onClick={() => setChat(service.ownerId)}
          >
            Написать исполнителю
          </button>
        </aside>
      </div>
    </>
  );
}
