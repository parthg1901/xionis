use cosmwasm_schema::cw_serde;
use cosmwasm_std::Addr;
use cw_storage_plus::Item;
use pyth_sdk_cw::PriceIdentifier;

#[cw_serde]
pub struct State {
    pub price_feed_id: PriceIdentifier,
    pub pyth_contract_addr: Addr,
}

pub const STATE: Item<State> = Item::new("state");
