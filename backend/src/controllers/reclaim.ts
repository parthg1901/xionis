import { Request, Response, NextFunction } from "express";
import Reclaim from "../models/reclaim";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

const providers = {
  binanceKYC: "2b22db5c-78d9-4d82-84f0-a9e0a4ed0470",
  github: "6d3f6753-7ee6-49ee-a545-62f1b1822ae5",
  gmailAccount: "f9f383fd-32d9-4c54-942f-5e9fda349762",
  linkedIn: "a9f1063c-06b7-476a-8410-9ff6e427e637",
  twitter: "e6fe962d-8b4e-4ce5-abcc-3d21c88bd64a",
};

const generateConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const APP_ID = process.env.APP_ID!;
  const APP_SECRET = process.env.APP_SECRET!;


  const PROVIDER_ID = providers[req.params.provider as keyof typeof providers];

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
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
  if (!user) {
    Reclaim.create({ address, verified: [provider] });
    res.sendStatus(200);
    return;
  }
  if (user.verified.includes(provider)) {
    res.status(400).json({ error: "Already verified" });
    return;
  }
  user.verified.push(provider);
  user.save();
  res.sendStatus(200);
};

const getUserVerfiedProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.params;
  const user = await Reclaim.findOne({ address });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(200).json({ verified: user.verified.map((provider) => providers[provider as keyof typeof providers]) });
}

export default { generateConfig, receiveProof, getUserVerfiedProviders };
