#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    Binary, Coin, Deps, DepsMut, Env, IbcMsg, MessageInfo, Response, StdResult, Uint128,
};
use cw2::set_contract_version;
// use cw2::set_contract_version;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{self, *};
use pyth_sdk_cw::PriceFeed;

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:lending_protocol";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const ONE: Uint128 = Uint128::one();

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

    Ok(Response::new().add_attribute("method", "instantiate"))
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

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    unimplemented!()
}

pub mod query {}
#[cfg(test)]
mod tests {}
