"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BriefcaseBusiness, ArrowUpRight, MessageCircle, UserRound, Mail, Send } from 'lucide-react';
import { useUI } from '@/lib/store';

const ChatPanel = dynamic(
  () => import("@/components/chat").then((module) => module.ChatPanel),
  { ssr: false },
);

export function Shell({ children }: { children: React.ReactNode }) {
  const setChat = useUI((s) => s.setChatPeer);
  const chatPeer = useUI((s) => s.chatPeer);
  const path = usePathname();
  return (
    <>
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#1a201b]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-5 px-5 py-5 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black tracking-tight"
          >
            <span className="rounded-xl bg-[#176b45] p-2 text-white">
              <BriefcaseBusiness size={23} />
            </span>
            работяги<span className="text-emerald-600">.</span>
          </Link>
          <span className="hidden text-base font-medium muted xl:block">
            Люди, которые помогут
          </span>
          <nav className="ml-auto flex items-center gap-3 text-sm">
            <Link
              href="/"
              className={
                path === "/" ? "font-semibold text-emerald-700" : "muted"
              }
            >
              Услуги
            </Link>
            <button
              aria-label="Открыть сообщения"
              className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setChat("anna")}
            >
              <MessageCircle size={20} />
            </button>

            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full border border-zinc-200 p-2 dark:border-zinc-700"
            >
              <UserRound size={19} />
              <span className="hidden sm:inline">Мой кабинет</span>
            </Link>
          </nav>
          <Link href="/account/services/new" className="primary hidden md:flex">
            Предложить услугу <ArrowUpRight size={16} />
          </Link>
          <ThemeSwitch />
        </div>
      </header>
      <main className="mx-auto min-h-[80vh] max-w-[1500px] px-5 py-7 lg:px-10">
        {children}
      </main>
      <ContactFooter />
      {chatPeer && <ChatPanel />}
    </>
  );
}

const themes = [
  { value: "light", label: "Светлая тема", image: "/icons/theme-light.jpg" },
  { value: "dark", label: "Тёмная тема", image: "/icons/theme-dark.jpg" },
] as const;

export function ThemeSwitch() {
  const theme = useUI((state) => state.resolvedTheme);
  const setTheme = useUI((state) => state.setTheme);
  const index = themes.findIndex((item) => item.value === theme);
  return (
    <div
      role="group"
      aria-label="Тема оформления"
      className="relative isolate flex shrink-0 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-1 left-1 top-1 -z-10 w-8 rounded-full bg-white shadow-sm transition-transform duration-200 motion-reduce:transition-none dark:bg-zinc-600"
        style={{ transform: `translateX(${index * 32}px)` }}
      />
      {themes.map(({ value, label, image }) => (
        <button
          key={value}
          aria-label={label}
          title={label}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${theme === value ? "text-emerald-700 dark:text-emerald-200" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          <img
            src={image}
            alt=""
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
            decoding="async"
          />
        </button>
      ))}
    </div>
  );
}

function BrandIcon({ brand }: { brand: "vk" | "max" | "mail" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="23"
      height="23"
      aria-hidden="true"
      fill="currentColor"
    >
      {brand === "vk" ? (
        <path d="M4 8h5c.3 7 3 10 5 11V8h5v6c2-2 4-4 5-6h5c-1 4-4 7-6 9 3 2 5 5 7 8h-6c-2-3-3-5-5-6v6h-1C8 25 4 19 4 8Z" />
      ) : brand === "max" ? (
        <>
          <path
            fillRule="evenodd"
            d="M16 3a13 13 0 0 0-11 20L3 29l7-2A13 13 0 1 0 16 3Zm0 5a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"
          />
          <path d="M10 19V12h3l3 4 3-4h3v7h-3v-3l-3 4-3-4v3Z" />
        </>
      ) : (
        <text x="2" y="25" fontSize="29" fontWeight="700" fontFamily="Arial">
          @
        </text>
      )}
    </svg>
  );
}

export function ContactFooter() {
  const contacts = [
    { name: "ВКонтакте", icon: <BrandIcon brand="vk" /> },
    { name: "MAX", icon: <BrandIcon brand="max" /> },
    { name: "Телеграмм", icon: <Send size={22} /> },
    { name: "mail.ru", icon: <BrandIcon brand="mail" /> },
  ];
  return (
    <footer className="mx-auto max-w-[1500px] border-t border-zinc-200 px-5 py-8 dark:border-zinc-800 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-7">
        <div>
          <p className="text-lg font-semibold">Связаться с нами</p>
          <a
            href="mailto:rabotyagii@list.ru"
            className="mt-3 inline-flex items-center gap-2 text-sm muted hover:text-emerald-600"
          >
            <Mail size={17} />
            rabotyagii@list.ru
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          {contacts.map((contact) => (
            <a
              key={contact.name}
              href=""
              onClick={(event) => event.preventDefault()}
              aria-label={contact.name}
              title={`${contact.name} — ссылка скоро появится`}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 text-zinc-600 transition hover:border-emerald-600 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-300"
            >
              {contact.icon}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-8 text-xs muted">
        © 2026 Работяги · На каждую задачу найдётся свой человек
      </p>
    </footer>
  );
}
