import { atom } from "recoil"
import type { UserType } from "./client/user"

export type AuthState = {
    walletType?: 'metamask' | 'wallet-collect' | 'coinbase' | undefined
    loginedUser?: UserType | undefined
}

const initAuthState: AuthState = {
    walletType: undefined,
    loginedUser: undefined
}

export const authState = atom<AuthState>({
    key: 'authState',
    default: initAuthState
})