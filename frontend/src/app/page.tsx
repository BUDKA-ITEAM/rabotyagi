import { publicQueryState } from "@/lib/server-state";
import { Suspense } from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { repository } from "@/lib/api";
import { Catalog } from "@/components/catalog";
export const dynamic = "force-dynamic";
export default async function Home() {
  const client = new QueryClient();
  await client.prefetchQuery({
    queryKey: ["services"],
    queryFn: () => repository.services(),
  });
  return (
    <HydrationBoundary state={publicQueryState(client)}>
      <Suspense fallback={<p>Загружаем каталог…</p>}>
        <Catalog />
      </Suspense>
    </HydrationBoundary>
  );
}
