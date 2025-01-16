use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Storage, StdResult};
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
pub struct State {
    pub contract: String
}

// Define the singleton state as a global constant using Item
const CONFIG: Item<State> = Item::new("config");

// Function to save the state
pub fn config(storage: &mut dyn Storage, state: &State) -> StdResult<()> {
    CONFIG.save(storage, state)
}

// Function to load the state
pub fn config_read(storage: &dyn Storage) -> StdResult<State> {
    CONFIG.load(storage)
}