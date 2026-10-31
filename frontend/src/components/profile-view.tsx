"use client";
import { useQuery } from "@tanstack/react-query";
import { repository } from "@/lib/api";
import { ServiceCard } from "@/components/service-card";
import { QueryState } from "@/components/ui";
import { useUI } from "@/lib/store";
import { Avatar } from "@/components/ui";
export function ProfileView({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["profiles"],
    queryFn: () => repository.profiles(),
  });
  const services = useQuery({
    queryKey: ["services"],
    queryFn: () => repository.services(),
  });
  const setChat = useUI((s) => s.setChatPeer);
  if (query.isPending || query.error)
    return <QueryState error={query.error} retry={() => query.refetch()} />;
  const profile = query.data?.find((p) => p.id === id);
  if (!profile) return <p>Профиль не найден.</p>;
  return (
    <div className="mx-auto max-w-5xl">
      <section className="panel p-8">
        <div className="mb-5">
          <Avatar profile={profile} className="h-20 w-20 text-2xl" />
        </div>
        <p className="text-xs muted">{profile.location}</p>
        <h1 className="mt-2 text-3xl font-semibold">{profile.name}</h1>
        <p className="mt-2 text-emerald-700">{profile.role}</p>
        <p className="my-5 max-w-xl leading-7 muted">{profile.about}</p>
        <button className="primary" onClick={() => setChat(id)}>
          Обсудить задачу
        </button>
      </section>
      <h2 className="mb-5 mt-9 text-2xl font-semibold">Услуги исполнителя</h2>
      {services.error || services.isPending ? (
        <QueryState error={services.error} retry={() => services.refetch()} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.data
            ?.filter((s) => s.ownerId === id)
            .map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
        </div>
      )}
    </div>
  );
}
