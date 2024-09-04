import { atom } from "recoil"
export type AuthUser = {
    address: string  //todo: how to valdiate by regex?
}
export type AuthState = {
    walletType?: 'metamask' | 'wallet-collect' | 'coinbase' | undefined
    user?: AuthUser | undefined
}

const initAuthState: AuthState = {
    walletType: undefined,
    user: undefined
}

export const authState = atom<AuthState>({
    key: 'authState',
    default: initAuthState
})