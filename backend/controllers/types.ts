// For Account
export type LoginInPutType = {
    name: string,
    password: string
}
export type AccountInfoType = {
    id?: string,
    name: string,
    password: string,
    roles: string[],
    email: string, 
    token?: string
}

//For user
export type UserRegisterInputType = {
    name: string,
    profile?: string,
    address: string,
    intro?: string
}

export type UserUpdateInputType = {
    id?: number,
    name?: string,
    profile?: string,
    intro?: string
}

//position
export type PositionInfoType = {
    tokenId: string;
    tickLower: number;
    tickUpper: number;
    token0: `0x${string}`;
    token1: `0x${string}`;
    owner: `0x${string}`;
    fee: number
}