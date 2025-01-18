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
  treasury: "xion1cp43h483qnqgayqm8mn8lavc74rpst077tu9xq2qk9rua50zhvhshmsfhq",
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
            treasury: treasuryConfig.treasury,
            contracts: [
              "xion1hy7p8aq7nlvg2j4v57z5dlwtvvz7awz2wl0sx3d3qrfelt99z8uqd9p6er",
            ],
          }}
        >
          {children}
        </AbstraxionProvider>
      </body>
    </html>
  );
}
