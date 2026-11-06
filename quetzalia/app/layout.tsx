import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quetzal-IA | Encuentro de mujeres en STEM",
  description:
    "Donde la lógica echa raíces y la innovación emprende el vuelo: el encuentro de mujeres que construyen el futuro en la FES Acatlán.",
  icons: {
    icon: "/QuetzaliaLogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
