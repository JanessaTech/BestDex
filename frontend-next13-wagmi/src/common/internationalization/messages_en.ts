import { MessageType } from "../types"


const message: MessageType = {
    //pool
    pool_fetch_latest_failed: 'Failed to fetch the latest poolInfo for poolAddress {0} and chainId {1} due to {2}',

    //positions
    positions_get_failed: 'Failed to get the position list for chainId {0} and owner {1} due to {2}',

    // token price
    token_price_get_failed: 'Failed to get token prices due to {0}',

    //transaction
    transaction_create_failed: 'Failed to create a new transaction {0} due to {1}',
    transaction_create_missing_from: 'Failed to log the new transaction beause of the missing from acount. Params: type={0} chainId={1} tokenId={2} tx={3} token0={4} token1={5} amount0={6} amount1={7}'
}

export default message