"use client";
import { Inter, Jersey_15 } from "next/font/google";
import "./globals.css";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jersey = Jersey_15({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jersey",
});

const treasuryConfig = {
  // treasury: "xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable + " " + jersey.variable}>
      <body className="font-[family-name:var(--font-inter)]">
        <AbstraxionProvider
          config={{
            contracts: [
              "xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka",
            ],
          }}
        >
          {children}
        </AbstraxionProvider>
      </body>
    </html>
  );
}
