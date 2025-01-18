"use client";
import Header from "@/components/header";
import Link from "next/link";
import { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-[120px] md:text-[150px] text-white tracking-tighter text-center font-[family-name:var(--font-jersey)]">
          XIONIS
        </h1>
        <p className="text-xl md:text-2xl text-white text-center max-w-3xl px-4">
          XIONIS is a Cross Chain Finance and DAO platform for XION Blockchain.
          Empowering decentralized finance and governance across multiple
          ecosystems.
        </p>
        <Link href={"/trust"} className="mt-8 px-8 py-3 bg-white text-black rounded-md text-lg font-semibold hover:bg-primary-dark transition duration-300">
          Get Started
        </Link>
      </main>
    </div>
  );
}
