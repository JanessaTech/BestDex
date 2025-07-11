'use client';

import { ReactNode, useEffect, useState } from "react"
import { useAccount, useDisconnect, useChainId, useConfig } from 'wagmi'
import { SiweMessage } from 'siwe'
import { signMessage } from '@wagmi/core'
import { useAuthState } from "@/config/store";
import { setCookie, deleteCookie } from 'cookies-next';
import { toast } from "sonner"
import SVGClose from "@/lib/svgs/svg_close";

class NetworkError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NetworkError';
    }
}

class JsonError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JsonError';
    }
}

type AuthenticationProviderProps = {
    children: ReactNode
}
const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({children}) => {
    const {auth, setAuth} = useAuthState()
    const {isConnected, address} = useAccount()
    const { disconnect } = useDisconnect()
    const chainId = useChainId()
    const config = useConfig()
    const [showModal, setShowModal] = useState(false)

    console.log('AuthenticationProvider.isConnected=', isConnected)
    console.log('showModal:', showModal)
    console.log('auth:', auth)
    useEffect(() => {
        if (isConnected) {
            if (auth !== 'authenticated') {
                setShowModal(true)
            } 
        } else {
            setShowModal(false)
            setAuth('unauthenticated')
            deleteCookie('token')
        }
    }, [isConnected])

    const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        disconnect()
    }

    const getNonce = async () => {
        try {
            const rawResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/siwe/nonce`, {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
              })
              console.log('[AuthenticationProvider] rawResponse=', rawResponse)
              const content = await rawResponse.json()
              if (!content?.success) {
                throw new JsonError(content?.message)
              }
              console.log('[AuthenticationProvider] getNonce ', content)
              return content?.data?.nonce
        } catch(e) {
            if (e instanceof JsonError) {
                throw e
            } else {
                throw new NetworkError('Failed to get nonce, please check network')
            }   
        }
      }
    
    const verify = async (data: {message: string, signature: `0x${string}`}) => {
        try {
            const rawResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/siwe/verify`, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            const content = await rawResponse.json()
            if (!content?.success) {
                throw new JsonError(content?.message)
            }
            console.log('[AuthenticationProvider] verify ',content)
            return content?.data?.verify
        } catch(e) {
            if ( e instanceof JsonError) {
                throw e
            } else {
                throw new NetworkError('Failed to verify signature, please check network')
            }
        }
    }

    const createSiweMessage = async(domain: string, origin: string, address: `0x${string}`, statement: string, chainId: number) => {
        const nonce = await getNonce()
        console.log(`a new nonce : ${nonce} in createSiweMessage`)
        const siweMessage = new SiweMessage({
          domain,
          address,
          statement,
          uri: origin,
          version: '1',
          chainId: Number(chainId)
        })
        return siweMessage.prepareMessage()
    }

    const handleVerify = async (e: React.MouseEvent<HTMLElement>) => {
        try {
            const domain = window.location.host
            const origin = window.location.origin
            const statement = `${process.env.NEXT_PUBLIC_APP_VERIFICATION}`
            const message = await createSiweMessage(domain, origin, address!, statement, chainId)
            console.log(message)
            const signature = await signMessage(config, { message: message })
            
            console.log('signature:', signature)
            if (!signature) throw Error('Invalid signature')
            const verified = await verify({message: message, signature: signature})
            console.log('[AuthenticationProvider] signInWithEthereu. verified:', verified)
            if (verified) {
                setShowModal(false)
                setAuth('authenticated')
                let token = 'fake-jwt-token'
                setCookie('token', token, { maxAge: 60 * 60 * 24 })
            } else {
                disconnect()
            }
        } catch (e: any) {
            toast.error('You failed to verify the message. Please try again')
            disconnect()  
        }    
    }

    const handleClose = () => {
        disconnect()
    }

    return (
        <div>
            {children}
            {
                showModal ? <div className={`fixed left-0 right-0 top-0 bottom-0 mx-auto bg-black/75 p-10 flex justify-center items-center z-50`}>
                                <div className="w-80 bg-zinc-800 rounded-3xl p-10 border-[1px] border-zinc-500 flex flex-col items-center gap-y-4 relative">
                                    <div><SVGClose className="w-7 h-7 hover:bg-zinc-700 active:bg-zinc-700/60 rounded-full p-1 cursor-pointer absolute right-5 top-5" onClick={handleClose}/></div>
                                    <span className="text-white text-xl font-semibold">Verify your account</span>
                                    <span className="text-sm text-zinc-400 text-center">To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account</span>
                                    <div className="px-4 py-1 rounded-full bg-pink-600 hover:bg-pink-600/80 cursor-pointer text-zinc-300 font-semibold text-sm active:bg-pink-600/70" onClick={handleVerify}>Verify</div>
                                    <div className="px-4 py-1 rounded-full  cursor-pointer text-zinc-300 hover:bg-zinc-700 font-semibold text-sm active:bg-zinc-700/85" onClick={handleCancel}>Cancel</div>
                                </div>
                            </div>
                : <></>
            }
            
        </div>
        
    )
}

export default AuthenticationProvider