use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Uint128};
#[cw_serde]
pub struct InstantiateMsg {
    pub channel_id: String,
}

#[cw_serde]
pub enum ExecuteMsg {
    IbcTransfer {
        recipient: String,
        amount: Uint128,
        denom: String,
        timeout_seconds: u64,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {}
