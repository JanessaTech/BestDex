import { MessageType } from "../types"


const message: MessageType = {
    //pool
    pool_fetch_latest_failed: 'Failed to fetch the latest poolInfo for poolAddress {0} and chainId {1} due to {2}',

    //positions
    positions_get_failed: 'Failed to get the position list for chainId {0} and owner {1} due to {2}',

    // token price
    token_price_get_failed: 'Failed to get token prices due to {0}',

    //transaction
    transaction_create_failed: 'Failed to create a new transaction {0} due to {1}'
}

export default message