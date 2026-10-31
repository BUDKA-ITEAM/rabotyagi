"use client";
import { useState } from 'react';
import type { Profile } from '@/lib/models';

export function Avatar({
  profile,
  className = "h-10 w-10",
}: {
  profile?: Pick<Profile, "name" | "avatar">;
  className?: string;
}) {
  const [failed, setFailed] = useState<string>();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-semibold text-emerald-800 ${className}`}
    >
      {profile?.avatar && failed !== profile.avatar ? (
        <img
          src={profile.avatar}
          alt={`Аватар: ${profile.name}`}
          onError={() => setFailed(profile.avatar)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-label={profile?.name || "Пользователь"}>
          {profile?.name
            ?.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("") || "?"}
        </span>
      )}
    </span>
  );
}

export function QueryState({
  error,
  retry,
}: {
  error?: Error | null;
  retry?: () => void;
}) {
  return (
    <div
      role={error ? "alert" : "status"}
      className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500"
    >
      {error ? (
        <>
          <p>{error.message}</p>
          <button
            onClick={retry}
            className="mt-4 font-semibold text-emerald-600"
          >
            Повторить
          </button>
        </>
      ) : (
        "Загружаем данные…"
      )}
    </div>
  );
}
