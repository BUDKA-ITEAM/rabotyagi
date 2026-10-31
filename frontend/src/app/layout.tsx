import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/providers";
import { Shell } from "@/components/site-layout";
export const metadata: Metadata = {
  title: {
    default: "Работяги — хорошие специалисты рядом",
    template: "%s · Работяги",
  },
  description: "Найдите специалиста для дома, учёбы и повседневных задач.",
};
const themeScript = `try{const t=JSON.parse(localStorage.getItem('rabotyagi-ui')||'{}').state?.theme||'system';document.documentElement.classList.toggle('dark',t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))}catch{}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
