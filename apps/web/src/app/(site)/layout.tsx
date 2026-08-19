import type { Metadata } from "next";
import type { ReactNode } from "react";
import { lato } from "@/app/site-font";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "World Gallery",
  description: "Travel sketch, architecture, and research works around the globe.",
};

export default function DefaultRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${lato.variable} bg-[#0f1230] text-[#f6f2ea] antialiased`}>
        {children}
      </body>
    </html>
  );
}
