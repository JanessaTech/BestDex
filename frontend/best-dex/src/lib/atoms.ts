import { atom } from "recoil"
import type { UserType } from "./client/user"

type WalletType = 'metamask' | 'wallet-collect' | 'coinbase' | undefined

export type AuthState = {
    walletType?: WalletType
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

export type SignupState = {
    open: boolean,
    address?: string,
    walletType?: WalletType
}
const initSignupState: SignupState = {
    open: false,
    address: '',
    walletType: undefined
}
export const signupState = atom<SignupState>({
    key: 'signupState',
    default: initSignupState
})


export type WalletAddressChangeState = {
    changed: boolean
}
const initWalletAddressChangeState: WalletAddressChangeState = {
    changed: false
}
export const walletAddressChangeState  = atom<WalletAddressChangeState>({
    key: 'walletAddressChangeState',
    default: initWalletAddressChangeState
})
