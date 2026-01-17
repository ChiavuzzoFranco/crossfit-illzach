import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";
import Navbar from "../components/Navbar";
import Cursor from "../components/Cursor";
import TransitionProvider from "../components/TransitionProvider"; // <--- Le Cerveau de la transition

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
      <body 
        className={`${anton.variable} ${manrope.variable} bg-bg text-offwhite overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {/* On enveloppe TOUT le site dans le provider de transition */}
        <TransitionProvider>
          
          {/* Le Curseur et la Navbar sont dedans pour bénéficier des transitions */}
          <Cursor />
          <Navbar />

          <SmoothScroll>
            {children}
            
            {/* Footer Global */}
            <footer className="py-12 border-t border-white/10 text-center font-body text-xs text-gray-500 bg-bg relative z-10">
              CROSSFIT ILLZACH © 2026 • DESIGNED FOR PERFORMANCE
            </footer>
          </SmoothScroll>

        </TransitionProvider>
      </body>
    </html>
  );
}