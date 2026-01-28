import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "World Gallery",
  description: "Travel sketch, architecture, and research works around the globe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${lato.variable} bg-[#0f1230] text-[#f6f2ea] antialiased`}>
        {children}
      </body>
    </html>
  );
}
