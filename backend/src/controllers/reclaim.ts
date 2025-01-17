import { Request, Response, NextFunction } from "express";
import Reclaim from "../models/reclaim";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

const generateConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const APP_ID = process.env.APP_ID!;
  const APP_SECRET = process.env.APP_SECRET!;
  const providers = {
    binanceKYC: "2b22db5c-78d9-4d82-84f0-a9e0a4ed0470",
    github: "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
    gmailAccount: "f9f383fd-32d9-4c54-942f-5e9fda349762",
    linkedIn: "a9f1063c-06b7-476a-8410-9ff6e427e637",
    twitter: "e6fe962d-8b4e-4ce5-abcc-3d21c88bd64a",
  };

  const PROVIDER_ID = providers[req.params.provider as keyof typeof providers];

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    );

    // Set the callback URL where proofs will be received
    reclaimProofRequest.setAppCallbackUrl(
      "http://localhost:8080/api/v1/reclaim/proof"
    );

    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString();

    res.json({ reclaimProofRequestConfig });
  } catch (error) {
    console.error("Error generating request config:", error);
    res.status(500).json({ error: "Failed to generate request config" });
  }
};

const receiveProof = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { proofs, provider, address } = req.body;
  console.log("Received proofs:", proofs);
  const user = await Reclaim.findOne({ address });
  user?.verified.push(provider);
  user?.save();
  res.sendStatus(200);
};

export default { generateConfig, receiveProof };
