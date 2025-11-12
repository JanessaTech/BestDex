import type { LoginInPutType, AccountInfoType } from "../../controllers/types/TypesInController"

export interface AccountService {
    login: (acc: LoginInPutType) => Promise<AccountInfoType>
    register: (acc: AccountInfoType) => Promise<AccountInfoType>
    getAllAccounts: () => Promise<{[k: string]: AccountInfoType}>
    getAccountById: (id: string) => Promise<AccountInfoType | undefined>
    getAccountByIdInSyn: (id: string) => AccountInfoType | undefined
    updateAccount: (acc: AccountInfoType) => Promise<AccountInfoType>
    deleteAccountById: (id: string) => Promise<void>
}

export interface UserService {  
}

export interface TokenPriceService {
    getLatestPrices: () => Promise<any>
}

export interface PositionService {
    getPositions: (chainId: number, owner: `0x${string}`) => Promise<any>
}