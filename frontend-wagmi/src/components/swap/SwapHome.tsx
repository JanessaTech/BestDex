'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { IContextUtil, useContextUtil } from '../providers/ContextUtilProvider'
import NetworkOption from '../common/NetworkOption'
import { useState } from 'react'
import TokenOption from '../common/TokenOption'
import { TokenType } from '@/lib/types'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()
    const chainId = useChainId()
    const curChain = chains.filter((c) => c.id === chainId)[0]
    const {getCurrentPath} = useContextUtil() as IContextUtil
    const [networkOpen, setNetworkOpen] = useState(false)
    const [tokenOpen, setTokenOpen] = useState(false)
    const [tokenFrom, setTokenFrom] = useState<TokenType | undefined>(undefined)
    const [tokenTo, setTokenTo] = useState<TokenType | undefined>(undefined)

    const onNetworkOpenChange = (open: boolean) => {
        setNetworkOpen(open)
    }

    const handleSwitchNetwork = (id: number)=> {
        setNetworkOpen(false)
        switchChain({chainId: id})
    }

    const onTokenOpenChange = (open: boolean) => {
        console.log('onTokenOpenChange:', open)
        setTokenOpen(open)
    }
    const handleSwitchToken = (chainId: number, address: string) => {
        console.log('chainId:', chainId, 'address:', address)
        setTokenOpen(false)
    }

    console.log('tokenFrom:', tokenFrom)
    
    return (
        <div>
            <div className='font-semibold text-xl my-10 md:hidden capitalize'>{getCurrentPath()}</div>
            <div className='bg-zinc-900 w-full md:w-[500px] h-96 rounded-xl md:mt-10 mx-auto p-10'>
                <NetworkOption 
                    networkOpen={networkOpen} 
                    curChain={curChain} 
                    chains={chains} 
                    onOpenChange={onNetworkOpenChange} 
                    handleSwitchNetwork={handleSwitchNetwork}/>
                <div className='my-8'>
                    <div className='font-semibold my-3'>Swap from</div>
                    <div className='h-16 flex w-full'>
                        <TokenOption 
                            tokenOpen={tokenOpen} 
                            chainId={chainId} 
                            curToken={tokenFrom}
                            onOpenChange={onTokenOpenChange} 
                            handleSwitchToken={handleSwitchToken}
                            updateToken={setTokenFrom}
                            />
                        <input className={`grow border-zinc-700 border-[1px] rounded-r-md 
                            box-border bg-zinc-900 px-3 focus:border-pink-600
                            ${tokenOpen ? 'hidden' : ''}`}></input>
                    </div>
                </div>      
            </div>    
        </div>
    )
}

export default SwapHome