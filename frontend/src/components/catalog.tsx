"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  GraduationCap,
  Hammer,
  Sparkles,
  Heart,
  Laptop,
  House,
  LayoutGrid,
} from "lucide-react";
import { repository } from "@/lib/api";
import { categories } from "@/lib/models";
import { ServiceCard } from "@/components/service-card";
import { QueryState } from "@/components/ui";
const icons = [
  LayoutGrid,
  GraduationCap,
  Hammer,
  Sparkles,
  Heart,
  Laptop,
  House,
];
export function Catalog() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => repository.services(),
  });
  const category = params.get("category") || "Все услуги";
  const search = params.get("q") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  function update(values: Record<string, string>) {
    const next = new URLSearchParams(params);
    next.delete("page");
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    window.history.pushState(null, "", `${window.location.pathname}?${next}`);
  }
  const filtered = (query.data || [])
    .filter(
      (item) =>
        (category === "Все услуги" || item.category === category) &&
        `${item.title} ${item.description}`
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (!params.get("max") || item.price <= Number(params.get("max"))),
    )
    .sort((a, b) => (params.get("sort") === "price" ? a.price - b.price : 0));
  const pages = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pages);
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[225px_minmax(0,1fr)]">
      <aside className="min-w-0 lg:sticky lg:top-7">
        <button
          type="button"
          aria-expanded={catalogOpen}
          aria-controls="catalog-categories"
          onClick={() => setCatalogOpen(open => !open)}
          className="panel flex w-full items-center justify-between px-4 py-3 font-semibold lg:hidden"
        >
          Каталог
          <ChevronDown size={20} className={`transition-transform motion-reduce:transition-none ${catalogOpen ? "rotate-180" : ""}`} />
        </button>
        <p className="mb-5 hidden text-[11px] font-bold tracking-[.15em] muted lg:block">
          КАТАЛОГ УСЛУГ
        </p>
        <div id="catalog-categories" className={`${catalogOpen ? "flex" : "hidden"} mt-2 flex-col gap-2 lg:mt-0 lg:flex`}>
          {categories.map((name, i) => {
            const Icon = icons[i];
            return (
              <button
                key={name}
                onClick={() =>
                  update({ category: name === "Все услуги" ? "" : name })
                }
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${category === name ? "bg-[#e5efdf] font-semibold text-[#245a36] dark:bg-emerald-950 dark:text-emerald-300" : "muted hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
              >
                <Icon size={18} className="shrink-0" />
                {name}
              </button>
            );
          })}
        </div>
        <div className="panel mt-8 hidden p-5 lg:block">
          <div className="mb-3 inline-flex rounded-xl bg-[#f0f4e7] p-2 text-[#176b45]">
            <House size={22} />
          </div>
          <h3 className="text-sm font-semibold">Умеете делать хорошо?</h3>
          <p className="mt-2 text-xs leading-5 muted">
            Расскажите о своих услугах. Ваши будущие клиенты уже здесь.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/account/services/new/`}
            className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700"
          >
            Стать исполнителем <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>
      <div className="min-w-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: new FormData(e.currentTarget).get("q") as string });
          }}
          className="panel mb-6 flex items-center gap-2 p-2"
        >
          <Search className="ml-3 shrink-0 muted" size={20} />
          <input
            key={search}
            name="q"
            defaultValue={search}
            placeholder="Какую задачу нужно решить?"
            aria-label="Поиск услуг"
            className="min-w-0 flex-1 !border-0 !bg-transparent"
          />
          <button className="primary">Найти</button>
        </form>
        <section className="relative mb-9 overflow-hidden rounded-3xl bg-[#e8efdc] p-7 text-[#203b28] sm:p-10">
          <div className="relative z-10 max-w-lg">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1.5 text-[11px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Меньше хлопот. Больше жизни.
            </span>
            <h1 className="text-3xl font-semibold leading-[1.12] tracking-tight sm:text-[44px]">
              Хорошие специалисты.
              <br />
              <span className="text-[#628051]">Для ваших важных дел.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#52624b]">
              От первого урока английского до ремонта на кухне — найдите
              человека, которому можно доверить задачу.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("results")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="primary mt-6"
            >
              Найти своего специалиста <ArrowUpRight size={16} />
            </button>
          </div>
          <div
            aria-hidden
            className="absolute -right-14 -bottom-20 hidden h-80 w-80 rotate-12 items-center justify-center rounded-[90px] border-[35px] border-[#d3dfc3] text-[130px] text-[#a9be92] xl:flex"
          >
            ✳
          </div>
        </section>
        <div
          id="results"
          className="mb-5 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[.15em] text-emerald-700">
              НАЙДЁТСЯ ТОТ, КТО ПОМОЖЕТ
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {category === "Все услуги" ? "Услуги для вас" : category}{" "}
              <span className="ml-2 text-sm font-normal muted">
                {filtered.length}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Максимальная цена"
              value={params.get("max") || ""}
              onChange={(e) => update({ max: e.target.value })}
              className="!py-2"
            >
              <option value="">Любая цена</option>
              <option value="1500">До 1 500 ₽</option>
              <option value="2500">До 2 500 ₽</option>
              <option value="5000">До 5 000 ₽</option>
            </select>
            <select
              aria-label="Сортировка"
              value={params.get("sort") || ""}
              onChange={(e) => update({ sort: e.target.value })}
              className="!py-2"
            >
              <option value="">По умолчанию</option>
              <option value="price">Сначала дешевле</option>
            </select>
          </div>
        </div>
        {query.isPending || query.error ? (
          <QueryState error={query.error} retry={() => query.refetch()} />
        ) : filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered
              .slice((currentPage - 1) * 6, currentPage * 6)
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
          </div>
        ) : (
          <div className="panel p-12 text-center">
            <h3 className="font-semibold">Пока ничего не нашлось</h3>
            <p className="my-3 text-sm muted">
              Попробуйте другой запрос или сбросьте фильтры.
            </p>
            <button className="primary" onClick={() => router.push("/")}>
              Сбросить фильтры
            </button>
          </div>
        )}
        {pages > 1 && (
          <nav aria-label="Страницы каталога" className="mt-7 flex gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                aria-current={currentPage === i + 1 ? "page" : undefined}
                className={currentPage === i + 1 ? "primary" : "panel px-4"}
                onClick={() => update({ page: String(i + 1) })}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        )}
        <p className="mt-8 text-center text-xs muted">
          Большие задачи начинаются с простого знакомства.
        </p>
      </div>
    </div>
  );
}
