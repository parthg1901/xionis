use {
    cosmwasm_std::entry_point,
    cosmwasm_std::to_json_binary,
    cosmwasm_std::{
         DepsMut, Binary, Deps, Env, MessageInfo, Response, StdResult, WasmMsg,
    },
};

use crate::msg::{ExecuteMsg, InstantiateMsg, ProofMsg, QueryMsg, QueryResponse};
use crate::state::{config, config_read, State};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State {
        contract: msg.contract
    };

    deps.api
        .debug(format!("Contract was initialized by {}", info.sender).as_str());
    config(deps.storage, &state)?;

    Ok(Response::default())
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::EmptyFunction {} => empty_function(deps),
    }
}

pub fn empty_function(_deps: Deps) -> StdResult<Binary> {
    to_json_binary(&(QueryResponse {count : 0}))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    let config = config_read(deps.storage)?;

    match msg {
        ExecuteMsg::VerifyProof(msg) => {
            verify_proof(deps, env, config.contract, msg)
        }
    }
}

pub fn verify_proof(
    _deps: DepsMut,
    _env: Env,
    contract: String,
    msg: ProofMsg,
) -> StdResult<Response> {
    let exec_msg = ExecuteMsg::VerifyProof(msg);

    let cosmos_msg = WasmMsg::Execute {
        contract_addr: contract,
        msg: to_json_binary(&exec_msg)?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(cosmos_msg)
        .add_attribute("action", "verify"))
}
