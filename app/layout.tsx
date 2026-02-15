import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import "./globals.css";
import ClientShell from "../components/ClientShell";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "CrossFit Illzach | Forge Your Legacy",
  description: "La référence du CrossFit et Hyrox en Alsace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${anton.variable} ${manrope.variable} bg-bg text-offwhite overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <ClientShell>
          {children}

          {/* Footer Global */}
          <footer className="py-12 border-t border-white/10 text-center font-body text-xs text-gray-400 bg-bg relative z-10">
            CROSSFIT ILLZACH © 2026 • made with ❤️ by <a href="https://www.instagram.com/cvz.franco/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors">Franco</a>
          </footer>
        </ClientShell>
      </body>
    </html>
  );
}
