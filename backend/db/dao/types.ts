
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
    _id?: number;
    chainId: number;
    tokenId: string;
    tx: string;
    token0: string;
    token1: string;
    txType: string;
    amount0: number;
    amount1: number;
    usd: number;
    from: string;
}

export type TransactionFilterType = {[P in keyof TransactionDAOParamType]?: TransactionDAOParamType[P]}