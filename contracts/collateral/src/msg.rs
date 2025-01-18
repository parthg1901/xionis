use pyth_sdk_cw::PriceIdentifier;

use cosmwasm_schema::{cw_serde, QueryResponses};

#[cw_serde]
pub struct MigrateMsg {}

#[cw_serde]
pub struct InstantiateMsg {
    pub price_feed_id: PriceIdentifier,
    pub pyth_contract_addr: String,
}

#[cw_serde]
pub enum ExecuteMsg {}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(DeltaResponse)]
    FetchDelta {},
}

#[cw_serde]
pub struct DeltaResponse {
    pub prices: Vec<i64>, // Prices for the last 7 days
    pub delta: i64,       // Difference between the most recent and oldest price
}
