import { publicQueryState } from "@/lib/server-state";
import { notFound } from "next/navigation";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { repository, demo } from "@/lib/api";
import { ServiceDetail } from "@/components/service-detail";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = (await repository.services().catch(() => [])).find(
    (s) => s.id === id,
  );
  return { title: item?.title || "Услуга", description: item?.description };
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = new QueryClient();
  const records = await repository.services().catch(() => null);
  if (records) {
    const localId = demo && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id);
    if (!localId && !records.some((s) => s.id === id)) notFound();
    client.setQueryData(["services"], records);
  }
  await client.prefetchQuery({
    queryKey: ["profiles"],
    queryFn: () => repository.profiles(),
  });
  return (
    <HydrationBoundary state={publicQueryState(client)}>
      <ServiceDetail id={id} />
    </HydrationBoundary>
  );
}
