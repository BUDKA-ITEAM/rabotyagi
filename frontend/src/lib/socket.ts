"use client";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { demo } from "@/lib/api";
export function useChatSocket(peer: string | null) {
  const client = useQueryClient();
  const [status, setStatus] = useState("Не подключено");
  const [typing, setTyping] = useState(false);
  const connection = useRef<Socket | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (demo || !url || !peer) return;
    const socket = io(url, { withCredentials: true, auth: { peerId: peer } });
    connection.current = socket;
    socket.on("connect", () => {
      setStatus("Подключено");
      socket.emit("conversation:join", { peerId: peer });
    });
    socket.on("disconnect", () => {
      setStatus("Переподключение…");
      setTyping(false);
    });
    socket.on("connect_error", () => setStatus("Нет связи с сервером"));
    socket.on("message:new", (event: { peerId: string }) => {
      if (event.peerId === peer)
        void client.invalidateQueries({ queryKey: ["messages", peer] });
    });
    socket.on("typing", (event: { peerId: string; typing: boolean }) => {
      if (event.peerId === peer) setTyping(event.typing);
    });
    return () => {
      if (timer.current) clearTimeout(timer.current);
      socket.emit("typing", { peerId: peer, typing: false });
      socket.removeAllListeners();
      socket.disconnect();
      connection.current = null;
    };
  }, [peer, client]);
  function notifyTyping() {
    if (!connection.current?.connected) return;
    connection.current.emit("typing", { peerId: peer, typing: true });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => connection.current?.emit("typing", { peerId: peer, typing: false }),
      1200,
    );
  }
  return { status, typing, notifyTyping };
}
