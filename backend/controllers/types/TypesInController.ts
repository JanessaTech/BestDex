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

