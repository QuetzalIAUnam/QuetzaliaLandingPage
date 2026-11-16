import type { Metadata } from "next";
import { Jost, Limelight } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const limelight = Limelight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quetzal-IA | Encuentro de mujeres en STEM",
  description:
    "Donde la lógica echa raíces y la innovación emprende el vuelo: el encuentro de mujeres que construyen el futuro en la FES Acatlán.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`scroll-smooth ${jost.variable} ${limelight.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
