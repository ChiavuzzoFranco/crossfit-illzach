import type { Metadata } from "next";
import { Anton, Manrope, Permanent_Marker } from "next/font/google";
import "./globals.css";
import ClientShell from "../components/ClientShell";
import JungleLeaves from "../components/jungle/JungleLeaves";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const brush = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-brush" });

export const metadata: Metadata = {
  title: "CrossFit Illzach",
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
        className={`${anton.variable} ${manrope.variable} ${brush.variable} bg-bg text-offwhite overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <ClientShell>
          {children}

          {/* Footer Global : la lisière de la jungle */}
          <footer className="relative z-10 isolate pt-24 pb-10 text-center">
            <JungleLeaves set="bottom" opacity={0.9} />
            <div className="relative">
              <p className="font-brush text-primary text-3xl md:text-4xl -rotate-2 mb-1">Rejoins la tribu</p>
              <p className="font-display uppercase text-white text-4xl md:text-6xl mb-8">CrossFit Illzach</p>
              <p className="font-body text-xs text-gray-400">
                4 Rue de Lisbonne, 68110 Illzach · 06 45 63 43 98 ·{' '}
                <a href="https://www.instagram.com/crossfitillzach/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
              </p>
              <p className="font-body text-xs text-gray-500 mt-3">
                CROSSFIT ILLZACH © 2026 • made with ❤️ by <a href="https://www.instagram.com/cvz.franco/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-white transition-colors">Franco</a>
              </p>
            </div>
          </footer>
        </ClientShell>
      </body>
    </html>
  );
}
