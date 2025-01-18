"use client";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal,
} from "@burnt-labs/abstraxion";
import { useEffect, useState } from "react";
import { Button } from "@burnt-labs/ui";
import Image from "next/image";
import Link from "next/link";
import Loan from "./loan";

export default function Header() {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [trustScore, setTrustScore] = useState<number | null>(null); // Store trust score
  const {
    data: { bech32Address },
  } = useAbstraxionAccount();
  const [, setShow] = useModal();

  useEffect(() => {
    const fetchTrustScore = async () => {
      if (bech32Address.length === 0) return; // Skip fetching if wallet isn't connected
      try {
        const response = await fetch(
          `https://xionis.onrender.com/api/v1/reclaim/${bech32Address}`
        );
        const userdata = await response.json();

        if (userdata?.verified) {
          const score = userdata.verified.length * 20; // Calculate trust score
          setTrustScore(score);
        }
      } catch (error) {
        console.error("Error fetching trust score:", error);
        setTrustScore(null); // Reset trust score on error
      }
    };

    fetchTrustScore();
  }, [bech32Address]);

  const getLoan = () => {
    setIsLoanModalOpen(true);
  };

  const closeLoanModal = () => {
    setIsLoanModalOpen(false);
  };

  return (
    <div className="flex flex-row justify-between items-center p-6 text-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <Link href="/">
        <Image
          src="/logo.jpg" // Replace with your actual logo path
          alt="Logo"
          width={50}
          height={50}
          className="object-contain mr-2"
          />
          </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Hi,{" "}
          <span className="text-blue-400">
            {bech32Address.length > 0
              ? `${bech32Address.slice(0, 4)}...${bech32Address.slice(-4)}`
              : "Guest"}
          </span>
        </h1>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setShow(true)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg text-white font-medium transition-all ease-in-out duration-200 transform hover:scale-105"
        >
          {bech32Address.length > 0
            ? `${bech32Address.slice(0, 4)}...${bech32Address.slice(-4)}`
            : "Connect Wallet"}
        </Button>
        <Link
          href="/governance"
          className="px-6 py-2 rounded-lg shadow-lg text-white font-medium transition-all ease-in-out duration-200 transform hover:scale-105"
        >
          Go To Governance
        </Link>
        <button
          onClick={getLoan}
          className="px-6 py-2 rounded-lg shadow-lg text-white font-medium transition-all ease-in-out duration-200 transform hover:scale-105"
        >
          Get Loan
        </button>
        {bech32Address.length > 0 && trustScore !== null && (
          <Link href="/trust" className="px-6 py-2 bg-blue-600 rounded-full shadow-lg text-white font-medium transition-all ease-in-out duration-200 transform hover:scale-105">
            Trust Score: {trustScore}
          </Link>
        )}
      </div>
      {isLoanModalOpen && <Loan score={trustScore} closeModal={closeLoanModal} />}

      <Abstraxion onClose={() => setShow(false)} />
    </div>
  );
}
