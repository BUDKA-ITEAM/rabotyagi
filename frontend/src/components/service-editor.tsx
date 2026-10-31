"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { serviceSchema, type ServiceInput } from "@/lib/models";
import { validateService } from "@/lib/actions";
import { repository } from "@/lib/api";
import { categories } from "@/lib/models";
import { QueryState } from "@/components/ui";
export function ServiceEditor({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["services"],
    queryFn: () => repository.services(),
  });
  if (query.isPending || query.error)
    return <QueryState error={query.error} retry={() => query.refetch()} />;
  const existing = query.data?.find((s) => s.id === id);
  if (id !== "new" && !existing) return <p>Объявление не найдено.</p>;
  if (existing && existing.ownerId !== "me")
    return <p>Редактирование недоступно.</p>;
  return <Editor key={id} id={id} initial={existing} />;
}
function Editor({ id, initial }: { id: string; initial?: ServiceInput }) {
  const client = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initial || {
      title: "",
      description: "",
      price: 1000,
      unit: "service",
      category: "Помощь по дому",
      location: "Москва",
      image: "",
    },
  });
  const image = watch("image");
  useEffect(() => {
    if (initial && !isDirty) reset(initial);
  }, [initial, isDirty, reset]);
  async function fileChanged(file?: File) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 1_500_000
    ) {
      setError("Выберите JPG, PNG или WebP размером до 1,5 МБ");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setValue("image", String(reader.result), { shouldValidate: true });
      setError("");
    };
    reader.onerror = () => setError("Не удалось прочитать изображение");
    reader.readAsDataURL(file);
  }
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-semibold">
        {id === "new" ? "Предложить услугу" : "Редактировать услугу"}
      </h1>
      <form
        className="panel space-y-5 p-6 sm:p-8"
        onSubmit={handleSubmit(async (values) => {
          try {
            setError("");
            const checked = await validateService(values);
            if (!checked.success) throw new Error(checked.error);
            await repository.saveService({ ...values, id, ownerId: "me" });
            await client.invalidateQueries({ queryKey: ["services"] });
            router.push("/account");
          } catch (e) {
            setError((e as Error).message);
          }
        })}
      >
        <label className="field">
          Название
          <input {...register("title")} />
          {errors.title && (
            <span className="text-red-600">{errors.title.message}</span>
          )}
        </label>
        <label className="field">
          Категория
          <select {...register("category")}>
            {categories.slice(1).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Описание
          <textarea rows={6} {...register("description")} />
          {errors.description && (
            <span className="text-red-600">{errors.description.message}</span>
          )}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="field">
            Цена, ₽
            <input
              type="number"
              min="1"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <span className="text-red-600">{errors.price.message}</span>
            )}
          </label>
          <label className="field">
            Расчёт стоимости
            <select {...register("unit")}>
              <option value="service">За услугу</option>
              <option value="hour">За час</option>
            </select>
          </label>
        </div>
        <label className="field">
          Город или онлайн
          <input {...register("location")} />
          {errors.location && (
            <span className="text-red-600">{errors.location.message}</span>
          )}
        </label>
        <label className="field">
          Изображение · до 1,5 МБ
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => fileChanged(e.target.files?.[0])}
          />
          {errors.image && (
            <span className="text-red-600">{errors.image.message}</span>
          )}
        </label>
        {image && (
          <img
            src={image}
            alt="Предпросмотр изображения услуги"
            className="h-48 w-full rounded-xl object-cover"
          />
        )}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button disabled={isSubmitting} className="primary">
          {isSubmitting ? "Сохраняем…" : "Сохранить услугу"}
        </button>
      </form>
    </div>
  );
}
