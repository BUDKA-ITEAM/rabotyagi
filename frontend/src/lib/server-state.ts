import { dehydrate, type QueryClient } from "@tanstack/react-query";
import { demo } from "./api";
export function publicQueryState(client: QueryClient) {
  const state = dehydrate(client);
  // Начальные данные SSR не должны затирать локальные изменения.
  if (demo)
    state.queries = state.queries.map((query) => ({
      ...query,
      state: { ...query.state, dataUpdatedAt: 0 },
    }));
  return state;
}
