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

