"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Send } from "lucide-react";
import { useUI } from "@/lib/store";
import { repository, demo } from "@/lib/api";
import { useChatSocket } from "@/lib/socket";
import { QueryState } from "@/components/ui";
import { Avatar } from "@/components/ui";
const schema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Введите сообщение")
    .max(2000, "Максимум 2000 символов"),
});
export function ChatPanel() {
  const peer = useUI((s) => s.chatPeer);
  return peer ? <Conversation key={peer} peer={peer} /> : null;
}
function Conversation({ peer }: { peer: string }) {
  const close = useUI((s) => s.setChatPeer);
  const client = useQueryClient();
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const { status, typing, notifyTyping } = useChatSocket(peer);
  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: () => repository.profiles(),
  });
  const messages = useQuery({
    queryKey: ["messages", peer],
    queryFn: () => repository.messages(peer),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { text: "" },
  });
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={dialog}
      onCancel={() => close(null)}
      aria-labelledby="chat-title"
      className="fixed inset-0 m-auto h-[min(650px,90dvh)] w-[min(560px,94vw)] overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/40 dark:border-zinc-700 dark:bg-[#1a201b] dark:text-zinc-100"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-700">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar profile={profiles.data?.find((p) => p.id === peer)} />
            <div>
              <h2 id="chat-title" className="font-semibold">
                {profiles.data?.find((p) => p.id === peer)?.name || "Сообщения"}
              </h2>
              {!demo && (
                <p className="mt-1 text-xs muted">
                  {typing ? "Печатает…" : status}
                </p>
              )}
            </div>
          </div>
          <button
            aria-label="Закрыть чат"
            onClick={() => close(null)}
            className="rounded-lg p-2"
          >
            <X size={20} />
          </button>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-zinc-200 px-5 py-3 dark:border-zinc-700">
          {profiles.data
            ?.filter((p) => p.id !== "me")
            .map((p) => (
              <button
                key={p.id}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs ${peer === p.id ? "bg-emerald-100 text-emerald-900" : "bg-zinc-100 text-zinc-600"}`}
                onClick={() => close(p.id)}
              >
                <Avatar profile={p} className="h-6 w-6 text-[10px]" />
                {p.name}
              </button>
            ))}
        </div>
        <div
          className="flex-1 space-y-3 overflow-y-auto p-5"
          aria-live="polite"
        >
          {messages.error || messages.isPending ? (
            <QueryState
              error={messages.error}
              retry={() => messages.refetch()}
            />
          ) : messages.data?.length ? (
            messages.data.map((message) => (
              <div
                key={message.id}
                className={`flex max-w-[95%] items-end gap-2 ${message.senderId === "me" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <Avatar
                  profile={profiles.data?.find(
                    (p) => p.id === message.senderId,
                  )}
                  className="h-8 w-8 text-xs"
                />
                <div
                  className={`min-w-0 rounded-2xl px-4 py-3 ${message.senderId === "me" ? "bg-[#e5efdf] text-zinc-900" : "bg-zinc-100 text-zinc-900"}`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.text}
                  </p>
                  <time className="mt-2 block text-right text-[10px] text-zinc-500">
                    {new Date(message.createdAt).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
            ))
          ) : (
            <p className="py-14 text-center text-sm muted">
              Начните с приветствия и расскажите о задаче.
            </p>
          )}
        </div>
        <form
          className="border-t border-zinc-200 p-4 dark:border-zinc-700"
          onSubmit={handleSubmit(async (value) => {
            try {
              await repository.sendMessage(peer, value.text);
              await client.invalidateQueries({ queryKey: ["messages", peer] });
              reset();
              setError("");
            } catch (e) {
              setError((e as Error).message);
            }
          })}
        >
          <div className="flex gap-2">
            <input
              aria-label="Сообщение"
              placeholder="Расскажите о вашей задаче…"
              {...register("text", { onChange: notifyTyping })}
              className="min-w-0 flex-1"
            />
            <button
              aria-label="Отправить сообщение"
              disabled={isSubmitting}
              className="primary !px-4"
            >
              <Send size={18} />
            </button>
          </div>
          <p role="alert" className="mt-2 text-xs text-red-600">
            {errors.text?.message || error}
          </p>
        </form>
      </div>
    </dialog>
  );
}
