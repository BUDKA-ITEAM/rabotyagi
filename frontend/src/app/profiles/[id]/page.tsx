import { publicQueryState } from "@/lib/server-state";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { repository, profiles as initialProfiles } from "@/lib/api";
import { ProfileView } from "@/components/profile-view";
import { notFound } from "next/navigation";
export function generateStaticParams() { return initialProfiles.map(profile => ({ id: profile.id })); }
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = (await repository.profiles().catch(() => [])).find(
    (p) => p.id === id,
  );
  return { title: profile?.name || "Профиль", description: profile?.about };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = new QueryClient();
  await Promise.all([
    client.prefetchQuery({
      queryKey: ["profiles"],
      queryFn: () => repository.profiles(),
    }),
    client.prefetchQuery({
      queryKey: ["services"],
      queryFn: () => repository.services(),
    }),
  ]);
  const profiles = client.getQueryData<import("@/lib/models").Profile[]>([
    "profiles",
  ]);
  if (profiles && !profiles.some((profile) => profile.id === id)) notFound();
  return (
    <HydrationBoundary state={publicQueryState(client)}>
      <ProfileView id={id} />
    </HydrationBoundary>
  );
}
