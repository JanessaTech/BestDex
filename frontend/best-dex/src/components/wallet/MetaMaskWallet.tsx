import { BrowserProvider, ethers } from 'ethers'
import { SiweMessage } from 'siwe'

import logger from "@/lib/logger"
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import getConfig from '@/config'

const config = getConfig()

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

const MetaMaskWallet = () => {
    const [isWalletLogin, setIsWalletLogin] = useState<boolean>(false)
    const [provider, setProvider] = useState<BrowserProvider | undefined>(undefined)
    const [signIn, setSignIn] = useState<boolean>(false)

    useEffect(() => {
        logger.debug('[MetaMaskWallet] useEffect. Call signInWithEthereum')
        if (provider && isWalletLogin && !signIn) {


        }
        if (signIn) {
        }
    }, [provider, isWalletLogin, signIn])

    const getNonce = async () => {
        try {
            const rawResponse = await fetch(`${config.BACKEND_ADDR}/apis/v1/siwe/nonce`, {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
              })
              logger.debug('[MetaMaskWallet] rawResponse=', rawResponse)
              const content = await rawResponse.json()
              if (!content?.success) {
                throw new JsonError(content?.message)
              }
              logger.debug('[MetaMaskWallet] getNonce ', content)
              return content?.data?.nonce
        } catch(e) {
            if (e instanceof JsonError) {
                throw e
            } else {
                throw new NetworkError('Failed to get nonce, please check network')
            }   
        }
      }
    
      const verify = async (data: {message: string, signature: string}) => {
        try {
            const rawResponse = await fetch(`${config.BACKEND_ADDR}/apis/v1/siwe/verify`, {
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
            logger.debug('[MetaMaskWallet] verify ',content)
            return content?.data?.verify
        } catch(e) {
            if ( e instanceof JsonError) {
                throw e
            } else {
                throw new NetworkError('Failed to verify signature, please check network')
            }
        }
    }

    const createSiweMessage = async(domain: string, origin: string, address: string, statement: string, chainId: bigint) => {
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

    const signInWithEthereum = async (): Promise<{'verified': boolean, 'signature': string, 'addr': string} | undefined> => {
        if (provider) {
            const domain = window.location.host
            const origin = window.location.origin
            logger.debug('[MetaMaskWallet] signInWithEthereum')
            const signer = await provider.getSigner();
            const address = await signer.getAddress()
            const normalizedAddress = ethers.getAddress(address)
            const statement = config.SignInEth
            const network  = await provider.getNetwork()
            logger.debug('[MetaMaskWallet] signInWithEthereu. network:', network)
            const chainId = (await provider.getNetwork()).chainId
            logger.debug('[MetaMaskWallet] signInWithEthereu. address=', address)
            logger.debug('[MetaMaskWallet] signInWithEthereu. normalizedAddress=', normalizedAddress)
            logger.debug('[MetaMaskWallet] signInWithEthereu. chainId=', chainId)
            const message = await createSiweMessage(domain, origin, normalizedAddress, statement, chainId)
            logger.debug(message)
            const signature = await signer.signMessage(message)
            logger.debug("[MetaMaskWallet] signInWithEthereu. signature:", signature)
            const verified = await verify({message: message, signature: signature})
            logger.debug('[MetaMaskWallet] signInWithEthereu. verified:', verified)
            return {'verified': verified, 'signature': signature, 'addr': normalizedAddress}
        }
        return undefined 
    }

    const isMetaMaskAvailable = (): boolean => {
        let vail = false
        if (window?.ethereum) {
            if (window.ethereum?.isMetaMask) {
                vail = true
            } else {
                toast.error("MetaMask is not available")
            }

        } else {
            toast.error("Ethereum support is not found")
        }
        return vail
    }
    const handleMetaMask = (): void => {
        const metaMaskAvailable = isMetaMaskAvailable()
        if (metaMaskAvailable) {
            logger.debug('[MetaMaskWallet] handleMetaMask metamask is available')
            const newProvider = new BrowserProvider(window.ethereum)
            newProvider.send('eth_requestAccounts', [])
            .then((response: any) => {
                logger.debug('[MetaMaskWallet] handleMetaMask response=', response)
                setIsWalletLogin(true)
                setProvider(newProvider)
            })
            .catch((e) => {
                if (e?.error?.code === -32002) {
                    toast.error("Please login MetaMask in browser extension")      
                } else if(e?.info?.error?.code === 4001) {
                    toast.error('User rejected the request.')
                } else {
                    toast.error(e?.error?.message)
                }
            })
        } else {
            toast.error("Please intall MetaMask")
        }
    }
    return (
        <li className="h-[100px] flex items-center hover:bg-zinc-200 px-5 border-b-[2px] border-b-white" onClick={handleMetaMask}>
                    <div className="w-[40px] h-[40px] border border-zinc-300 rounded-lg 
                                    bg-white flex justify-center items-center">
                        <img src="/imgs/wallets/metamask.svg" 
                            alt="metamask wallet" 
                            width={25} height={25}/>
                    </div>
                    <span className="ml-2">MetaMask</span>
        </li>
    )
}

export default MetaMaskWallet