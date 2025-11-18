export type UserDAOParamType = {
    _id?: number,
    name?: string,
    profile?: string,
    address: string,
    intro?: string,
    loginTime?: Date,
    logoutTime?: Date

}

export type TransactionDAOParamType = {
    chainId: number,
    tokenId: string,
    tx: string,
    token0: string,
    token1: string,
    txType: string,
    amount0: number,
    amount1: number,
    usd: number,
    from: string
}