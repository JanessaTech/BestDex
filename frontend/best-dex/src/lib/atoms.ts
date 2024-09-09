import { atom } from "recoil"
import type { UserType } from "./client/user"

const localStorageEffect = (key: string) => ({setSelf, onSet}: {setSelf: Function, onSet: Function}) => {
    if (typeof window !== 'undefined') {
        const savedValue = localStorage.getItem(key)
        if (savedValue != null) {
          setSelf(JSON.parse(savedValue))
        }
        onSet((newValue: any) => {
          localStorage.setItem(key, JSON.stringify(newValue))
        })
    }
  }

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
    default: initAuthState,
    effects_UNSTABLE: [
        localStorageEffect('current_user'),
      ]
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
