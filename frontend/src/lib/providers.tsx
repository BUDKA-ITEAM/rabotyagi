"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useUI } from "@/lib/store";
import { demo } from "@/lib/api";
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: demo ? 0 : 1,
            refetchOnWindowFocus: !demo,
          },
        },
      }),
  );
  const theme = useUI((state) => state.theme);
  const setResolvedTheme = useUI((state) => state.setResolvedTheme);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.classList.toggle("dark", resolved === "dark");
      setResolvedTheme(resolved);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [theme, setResolvedTheme]);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
