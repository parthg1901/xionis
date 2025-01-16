#![allow(non_snake_case)]

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct ClaimInfo {
    pub provider: String,
    pub parameters: String,
    pub context: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CompleteClaimData {
    pub identifier: String,
    pub owner: String,
    pub epoch: u64,
    pub timestampS: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct SignedClaim {
    pub claim: CompleteClaimData,
    pub signatures: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct Proof {
    pub claimInfo: ClaimInfo,
    pub signedClaim: SignedClaim,
}
