"use client";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Avatar } from "@/components/ui";
import { prepareAvatar } from "@/lib/avatar";
export function AvatarUpload({
  name,
  value,
  onChange,
  onStatus,
}: {
  name: string;
  value?: string;
  onChange: (value: string) => void;
  onStatus: (message: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <Avatar
        profile={{ name, avatar: value }}
        className="h-20 w-20 text-2xl"
      />
      <input
        ref={input}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        aria-label="Файл аватара"
        className="sr-only"
        disabled={busy}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setBusy(true);
          onStatus("Обрабатываем изображение…");
          try {
            const avatar = await prepareAvatar(file);
            onChange(avatar);
            onStatus("Аватар выбран. Нажмите «Сохранить профиль»");
          } catch (error) {
            onStatus((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      <button
        type="button"
        className="primary"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        <Upload size={16} />
        {busy ? "Обрабатываем…" : "Загрузить аватар с устройства"}
      </button>
      <p className="text-xs muted">PNG, JPG или JPEG · до 10 МБ</p>
      {value && (
        <button
          type="button"
          disabled={busy}
          className="text-xs text-red-600"
          onClick={() => onChange("")}
        >
          Убрать аватар
        </button>
      )}
    </div>
  );
}
