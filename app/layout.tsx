import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Programa de Afiliados | VC Marmitas / Vani Aguiar",
  description:
    "Indique o Cardápio Fitness Congelado da Vani Aguiar e receba comissões de até 8% + bônus por recorrência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
