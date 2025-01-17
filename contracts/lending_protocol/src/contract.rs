use cosmwasm_schema::Api;
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    Addr, Binary, Coin, Deps, DepsMut, Env, IbcMsg, MessageInfo, Response, StdResult, Uint128,
};
use cw2::set_contract_version;
// use cw2::set_contract_version;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{self, *};
use pyth_sdk_cw::{
    get_update_fee, get_valid_time_period, query_price_feed, PriceFeedResponse, PriceIdentifier,
};
use std::time::Duration;

// contract address: xion1hy7p8aq7nlvg2j4v57z5dlwtvvz7awz2wl0sx3d3qrfelt99z8uqd9p6er
// pyth price feed address : xion1w39ctwxxhxxc2kxarycjxj9rndn65gf8daek7ggarwh3rq3zl0lqqllnmt
// version info for migration info
const CONTRACT_NAME: &str = "crates.io:lending_protocol";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const ONE: Uint128 = Uint128::one();
const PRICE_FEED: &str = "xion1w39ctwxxhxxc2kxarycjxj9rndn65gf8daek7ggarwh3rq3zl0lqqllnmt";

const PRICE_IDENTIFIER: &str = "BTCUSD";

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    // let user_info = UserInfo {
    //     address: info.sender,
    //     loans: vec![],
    // };

    let state = State {
        channel_id: msg.channel_id,
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    match msg {
        ExecuteMsg::IbcTransfer {
            recipient,
            amount,
            denom,
            timeout_seconds,
        } => execute_ibc_transfer(deps, env, info, recipient, amount, denom, timeout_seconds),
    }
}

fn execute_ibc_transfer(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    recipient: String,
    amount: Uint128,
    denom: String,
    timeout_seconds: u64,
) -> StdResult<Response> {
    let state = STATE.load(deps.storage)?;

    let ibc_msg = IbcMsg::Transfer {
        channel_id: state.channel_id,
        to_address: recipient.to_string(),
        amount: Coin::new(amount, denom.to_string()),
        timeout: env.block.time.plus_seconds(timeout_seconds).into(),
        memo: None,
    };

    Ok(Response::new()
        .add_message(ibc_msg)
        .add_attribute("action", "ibc_transfer")
        .add_attribute("recipient", recipient)
        .add_attribute("amount", amount.to_string())
        .add_attribute("denom", denom))
}
fn calculate_collateral_amount(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    recipient: String,
    amount: Uint128,
) -> Uint128 {
    let PRICE_FEED_ADDRESS: Addr = Addr::unchecked(PRICE_FEED);
    ONE
}
fn query_fetch_price(deps: Deps, env: Env, info: MessageInfo) -> StdResult<Response> {
    unimplemented!()
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    unimplemented!()
}

pub mod query {}
#[cfg(test)]
mod tests {}
