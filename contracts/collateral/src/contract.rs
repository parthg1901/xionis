#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Addr, Uint128};


use crate::{
    msg::{DeltaResponse, InstantiateMsg, QueryMsg},
    state::{State, STATE},
};
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult};
use pyth_sdk_cw::{query_price_feed, PriceFeedResponse};

const ONE:Uint128 = Uint128::one();


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State {
        pyth_contract_addr: deps.api.addr_validate(&msg.pyth_contract_addr)?,
        price_feed_id: msg.price_feed_id,
    };
    STATE.save(deps.storage, &state);

    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
// pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
//     match msg {
//         QueryMsg::FetchDelta {} => to_binary(&query_fetch_delta(deps, env)?),
//     }
// }

// fn query_fetch_delta(deps: Deps, env: Env) -> StdResult<DeltaResponse> {
//     let state = STATE.load(deps.storage)?;

//     let mut prices = Vec::new();
//     let mut current_time = env.block.time.seconds() as i64;

//     // Fetch prices for the last 7 days
//     for _ in 0..7 {
//         let price_feed_response: PriceFeedResponse =
//             query_price_feed(&deps.querier, state.pyth_contract_addr.clone(), state.price_feed_id).unwrap();

//         if let Some(price_data) = price_feed_response
//             .price_feed
//             .get_price_no_older_than(current_time, 60)
//         {
//             prices.push(price_data.price);
//         } else {
//             return Err(StdError::generic_err("Price data not available for all days"));
//         }

//         // Move to the previous day (subtract 1 day in seconds)
//         current_time -= 86_400;
//     }

//     if prices.len() < 2 {
//         return Err(StdError::generic_err("Not enough price data to calculate delta"));
//     }

//     // Calculate the delta (difference between most recent and oldest prices)
//     let delta = prices[0] - prices[prices.len() - 1];

//     Ok(DeltaResponse { prices, delta })
// }

fn query_delta(deps: Deps, env: Env)->Uint128 {
    let fixed_rate:Uint128 = 150u128.into();
    ONE * fixed_rate
    
}

