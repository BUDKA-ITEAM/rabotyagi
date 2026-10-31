"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import type { Profile } from "@/lib/models";
import { repository } from "@/lib/api";
import { profileSchema } from "@/lib/models";
import { AvatarUpload } from "./avatar-upload";
export function ProfileEditor({ profile }: { profile: Profile }) {
  const client = useQueryClient();
  const [status, setStatus] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });
  useEffect(() => {
    if (!isDirty) reset(profile);
  }, [profile, reset, isDirty]);
  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (value) => {
        try {
          const saved = await repository.saveProfile({
            ...value,
            id: profile.id,
          });
          client.setQueryData<Profile[]>(["profiles"], (records) =>
            records?.map((item) => (item.id === saved.id ? saved : item)),
          );
          reset(saved);
          setStatus("Профиль сохранён");
        } catch (error) {
          setStatus((error as Error).message);
        }
      })}
    >
      <AvatarUpload
        name={profile.name}
        value={watch("avatar")}
        onChange={(value) => setValue("avatar", value, { shouldDirty: true })}
        onStatus={setStatus}
      />
      {(
        [
          { key: "name", label: "Имя" },
          { key: "role", label: "Специализация" },
          { key: "location", label: "Город" },
          { key: "about", label: "О себе" },
        ] as const
      ).map(({ key, label }) => (
        <label key={key} className="field">
          {label}
          {key === "about" ? (
            <textarea rows={4} {...register(key)} />
          ) : (
            <input {...register(key)} />
          )}
          <span className="text-xs text-red-600">{errors[key]?.message}</span>
        </label>
      ))}
      <button disabled={isSubmitting} className="primary w-full">
        {isSubmitting ? "Сохраняем…" : "Сохранить профиль"}
      </button>
      <p role="status" className="text-xs muted">
        {status}
      </p>
    </form>
  );
}
