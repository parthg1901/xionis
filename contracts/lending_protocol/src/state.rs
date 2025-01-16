use cosmwasm_std::Uint128;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]

// pub struct UserInfo {
//     pub address: Addr,
//     pub loans: Vec<Uint128>,
//     // the amount of tokens the user has deposited in the protocol
// }

//pub const USER_INFO: Item<UserInfo> = Item::new("user_info");

pub struct State {
    pub channel_id: String,
}

pub const STATE: Item<State> = Item::new("state");
