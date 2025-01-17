"use client";
import { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";
import { ReclaimProofRequest, Proof } from "@reclaimprotocol/js-sdk";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";

function ReclaimDemo() {
  // State to store the verification request URL
  const [requestUrl, setRequestUrl] = useState("");

  const [myProviders, setMyProviders] = useState<
    {
      name: string;
      providerId: string;
      logoURL: string;
    }[]
  >([]);

  const [verified, setVerified] = useState<
    {
      name: string;
      providerId: string;
      logoURL: string;
    }[]
  >([]);

  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [showButton, setShowButton] = useState(true);
  const [showQR, setShowQR] = useState(false);

  const { Canvas } = useQRCode();
  const {
    data: { bech32Address },
  } = useAbstraxionAccount();

  const [proofs, setProofs] = useState<string[] | Proof | undefined>(undefined);

  const getVerificationReq = async (providerId: string) => {
    const providerNames = {
      "2b22db5c-78d9-4d82-84f0-a9e0a4ed0470": "binanceKYC",
      "6d3f6753-7ee6-49ee-a545-62f1b1822ae5": "github",
      "f9f383fd-32d9-4c54-942f-5e9fda349762": "gmailAccount",
      "a9f1063c-06b7-476a-8410-9ff6e427e637": "linkedIn",
      "e6fe962d-8b4e-4ce5-abcc-3d21c88bd64a": "twitter",
    };

    const response = await fetch(
      "https://xionis.onrender.com/api/v1/reclaim/config/" +
        providerNames[providerId as keyof typeof providerNames]
    );
    const { reclaimProofRequestConfig } = await response.json();

    // Step 2: Initialize the ReclaimProofRequest with the received configuration
    const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
      reclaimProofRequestConfig
    );

    // Generate the verification request URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    console.log("Request URL:", requestUrl);
    setRequestUrl(requestUrl);
    setShowQR(true);
    setShowButton(false);

    // Start listening for proof submissions
    await reclaimProofRequest.startSession({
      // Called when the user successfully completes the verification
      onSuccess: async (proofs) => {
        if (proofs) {
          if (typeof proofs === "string") {
            // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
            console.log("SDK Message:", proofs);
            setProofs([proofs]);
          } else if (typeof proofs !== "string") {
            // When using the default callback url, we get a proof object in the response
            const res = await fetch(
              "https://xionis.onrender.com/api/v1/reclaim/proof",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  proofs: proofs.identifier,
                  provider: "github",
                  address: bech32Address,
                }),
              }
            );
            if (res.status === 200) {
              console.log("Verification success", proofs?.claimData.context);
              setProofs(proofs);
            }
          }
        }
        // Add your success logic here, such as:
        // - Updating UI to show verification success
        // - Storing verification status
        // - Redirecting to another page
      },
      // Called if there's an error during verification
      onError: (error) => {
        console.error("Verification failed", error);

        // Add your error handling logic here, such as:
        // - Showing error message to user
        // - Resetting verification state
        // - Offering retry options
      },
    });
  };

  useEffect(() => {
    if (bech32Address.length === 0) return;
    const providers = [
      "2b22db5c-78d9-4d82-84f0-a9e0a4ed0470",
      "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
      "f9f383fd-32d9-4c54-942f-5e9fda349762",
      "a9f1063c-06b7-476a-8410-9ff6e427e637",
      "e6fe962d-8b4e-4ce5-abcc-3d21c88bd64a",
    ];

    const fetchProviders = async () => {
      try {
        // Fetching all providers
        const response = await fetch(
          "https://api.reclaimprotocol.org/api/providers/verified"
        );
        const data = await response.json();

        if (data.providers) {
          const formattedProviders = data.providers
            .map((provider: any) => ({
              name: provider.name,
              providerId: provider.httpProviderId,
              logoURL: provider.logoUrl,
            }))
            .filter((provider: any) => providers.includes(provider.providerId));

          console.log("formattedProviders", formattedProviders);

          // Fetching user's verified providers
          const userResponse = await fetch(
            "https://xionis.onrender.com/api/v1/reclaim/" + bech32Address
          );
          const userdata = await userResponse.json();

          console.log(
            "Number of verified providers:",
            userdata.verified.length
          );

          // Filter verified providers
          if (userdata.verified.length > 0) {
            const verifiedProviders = formattedProviders.filter(
              (provider: any) => userdata.verified.includes(provider.providerId)
            );

            console.log("verifiedProviders", verifiedProviders);
            setVerified(verifiedProviders);

            const nonVerifiedProviders = formattedProviders.filter(
              (provider: any) =>
                !userdata.verified.includes(provider.providerId)
            );

            console.log("nonVerifiedProviders", nonVerifiedProviders);
            setMyProviders(nonVerifiedProviders);
          } else {
            setMyProviders(formattedProviders);
          }
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };

    fetchProviders();
  }, [bech32Address]);

  const handleButtonClick = (providerId: string) => {
    setProofs(undefined);
    getVerificationReq(providerId);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              XIONIS Trust Score
            </h1>
            <p className="text-xl text-center text-gray-300">
              The higher is your score, the more collateral discounts you get.
            </p>
            <p className="text-xl mb-12 text-center text-gray-300">
              Your Score - {verified.length * 20}
            </p>
            <div className="flex flex-col lg:flex-row gap-12 mb-16">
              <div className="bg-[#1e293b] p-8 rounded-lg shadow-xl order-2 lg:order-1 lg:w-1/2">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                  Verified Apps
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {verified.map((provider) => (
                    <div
                      key={provider.providerId}
                      className="bg-[#123357] p-4 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col items-center"
                    >
                      <img
                        src={provider.logoURL}
                        alt={provider.name}
                        className="h-16 w-16 object-contain mb-2"
                      />
                      <span className="text-white font-medium text-center">
                        {provider.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verify More Accounts */}
              <div className="bg-[#1e293b] p-8 rounded-lg shadow-xl order-1 lg:order-2 lg:w-1/2">
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                  Verify More Accounts
                </h2>
                {!showQR && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {myProviders.map((provider) => (
                      <div
                        key={provider.providerId}
                        onClick={() => handleButtonClick(provider.providerId)}
                        className="bg-[#123357] p-4 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col items-center hover:bg-blue-800 transition duration-300"
                      >
                        <img
                          src={provider.logoURL}
                          alt={provider.name}
                          className="h-16 w-16 object-contain mb-2"
                        />
                        <span className="text-white font-medium text-center">
                          {provider.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {showQR && (
                  <div className="bg-white p-6 rounded-lg shadow-inner mb-6">
                    <>
                      <div className="mb-4 flex justify-center">
                        <Canvas
                          text={requestUrl}
                          options={{
                            errorCorrectionLevel: "M",
                            margin: 3,
                            scale: 4,
                            width: 200,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                        <span className="text-blue-300 ml-2">
                          Waiting for proofs...
                        </span>
                      </div>
                      <button
                        onClick={() => window.open(requestUrl, "_blank")}
                        className="w-full bg-green-500 mt-4 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                      >
                        Open Link
                      </button>
                      <button
                        onClick={() => {
                          setShowQR(false);
                          setShowButton(true);
                          setRequestUrl("");
                        }}
                        className="w-full bg-gray-500 mt-4 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default ReclaimDemo;
