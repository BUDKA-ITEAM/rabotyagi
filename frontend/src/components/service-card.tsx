import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Service } from "@/lib/models";
export const priceLabel = (service: Service) =>
  `${service.price.toLocaleString("ru-RU")} ₽${service.unit === "hour" ? " / час" : " / услуга"}`;
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.id}`}
      prefetch={false}
      className="panel group overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[1.65] overflow-hidden bg-zinc-100">
        <img
          src={service.image}
          alt=""
          loading="lazy"
          decoding="async"
          width={600}
          height={364}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-medium text-zinc-700">
          {service.category}
        </span>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-1 text-xs muted">
          <MapPin size={12} />
          {service.location}
        </div>
        <h3 className="min-h-12 text-base font-semibold leading-6">
          {service.title}
        </h3>
        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span className="text-sm font-bold">{priceLabel(service)}</span>
          <span className="rounded-full bg-[#edf4e9] p-2 text-[#176b45]">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </Link>
  );
}
