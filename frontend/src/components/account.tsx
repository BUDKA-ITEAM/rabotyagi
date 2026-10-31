"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { repository } from "@/lib/api";
import { ServiceCard } from "@/components/service-card";
import { ProfileEditor } from "@/components/profile-editor";
import { QueryState } from "@/components/ui";
export function Account() {
  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => repository.services(),
  });
  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: () => repository.profiles(),
  });
  const me = profiles.data?.find((p) => p.id === "me");
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs text-emerald-700">ЛИЧНЫЙ КАБИНЕТ</p>
          <h1 className="text-3xl font-semibold">Моё рабочее пространство</h1>
        </div>
        <Link href="/account/services/new" className="primary">
          + Добавить услугу
        </Link>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="panel p-6">
          <h2 className="mb-5 text-lg font-semibold">Мой профиль</h2>
          {profiles.isPending || profiles.error ? (
            <QueryState
              error={profiles.error}
              retry={() => profiles.refetch()}
            />
          ) : me ? (
            <ProfileEditor key={me.id} profile={me} />
          ) : (
            <p>Профиль недоступен</p>
          )}
        </aside>
        <section>
          <h2 className="mb-5 text-xl font-semibold">Мои услуги</h2>
          {query.isPending || query.error ? (
            <QueryState error={query.error} retry={() => query.refetch()} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {query.data
                ?.filter((s) => s.ownerId === "me")
                .map((s) => (
                  <div key={s.id} className="flex flex-col gap-3">
                    <ServiceCard service={s} />
                    <Link
                      className="text-center text-sm font-semibold text-emerald-700"
                      href={`/account/services/edit/?id=${encodeURIComponent(s.id)}`}
                    >
                      Редактировать
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
