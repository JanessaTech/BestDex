'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { IContextUtil, useContextUtil } from '../providers/ContextUtilProvider'
import NetworkOption from '../common/NetworkOption'
import { useEffect, useState } from 'react'
import TokenOption from '../common/TokenOption'
import { TokenType } from '@/lib/types'
import ArrowUpDown from '@/lib/svgs/svg_arrow_updown'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()
    const chainId = useChainId()
    const curChain = chains.filter((c) => c.id === chainId)[0]
    const {getCurrentPath} = useContextUtil() as IContextUtil
    const [networkOpen, setNetworkOpen] = useState(false)

    const [tokenFromOpen, setTokenFromOpen] = useState(false)
    const [tokenToOpen, setTokenToOpen]  = useState(false)
    const [tokenFrom, setTokenFrom] = useState<TokenType | undefined>(undefined)
    const [tokenTo, setTokenTo] = useState<TokenType | undefined>(undefined)
    

    useEffect(() => {
        // reset tokenFrom &tokenTo when chainId is changed
        setTokenFrom(undefined)
        setTokenTo(undefined)
    }, [chainId])

    const onNetworkOpenChange = (open: boolean) => {
        setNetworkOpen(open)
    }

    const handleSwitchNetwork = (id: number)=> {
        setNetworkOpen(false)
        switchChain({chainId: id})
        setTokenFrom(undefined)
        setTokenTo(undefined)
    }

    const onTokenFromOpenChange = (open: boolean) => {
        setTokenFromOpen(open)
    }

    const onTokenFromToChange = (open: boolean) => {
        setTokenToOpen(open)
    }

    const closeTokenFromOption = () => {
        setTokenFromOpen(false)
    }
    const closeTokenToOption = () => {
        setTokenToOpen(false)
    }

    const exChangeTokens = () => {
        const from = tokenFrom
        const to = tokenTo
        setTokenFrom(to)
        setTokenTo(from)
    }
    
    return (
        <div>
            <div className='font-semibold text-xl my-10 md:hidden capitalize'>{getCurrentPath()}</div>
            <div className='bg-zinc-900 w-full md:w-[500px] rounded-xl md:mt-10 mx-auto p-10'>
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
                            tokenOpen={tokenFromOpen} 
                            chainId={chainId} 
                            curToken={tokenFrom}
                            showFull={false}
                            onOpenChange={onTokenFromOpenChange} 
                            closeTokenOption={closeTokenFromOption}
                            updateToken={setTokenFrom}
                            />
                        <input className={`grow border-zinc-700 border-[1px] rounded-r-md 
                            box-border bg-zinc-900 px-3 focus:border-pink-600
                            ${tokenFromOpen ? 'hidden' : ''}`}></input>
                    </div>
                </div> 
                <div className='my-8 flex justify-center'>
                    <ArrowUpDown className='w-6 h-6 cursor-pointer hover:text-pink-600' onClick={exChangeTokens}/>
                </div>     
                <div className='my-8'>
                    <div className='font-semibold my-3'>Swap to</div>
                    <div className='h-16 flex w-full'>
                            <TokenOption 
                                tokenOpen={tokenToOpen} 
                                chainId={chainId} 
                                curToken={tokenTo}
                                onOpenChange={onTokenFromToChange} 
                                closeTokenOption={closeTokenToOption}
                                updateToken={setTokenTo}
                            />
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default SwapHome