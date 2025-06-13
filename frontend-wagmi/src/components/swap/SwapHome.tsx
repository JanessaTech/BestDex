'use client'

import { useAccount, useChainId, useSwitchChain} from 'wagmi'
import { IContextUtil, useContextUtil } from '../providers/ContextUtilProvider'
import NetworkOption from '../common/NetworkOption'
import { useEffect, useState } from 'react'
import TokenOption from '../common/TokenOption'
import { TokenType } from '@/lib/types'
import ArrowUpDown from '@/lib/svgs/svg_arrow_updown'
import { Button } from "@/components/ui/button"
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Setting from '../common/Setting'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()
    const chainId = useChainId()
    const { openConnectModal } = useConnectModal()
    const { isConnected } = useAccount()
    const curChain = chains.filter((c) => c.id === chainId)[0]
    const {getCurrentPath} = useContextUtil() as IContextUtil
    const [networkOpen, setNetworkOpen] = useState(false)
    const [tokenFromOpen, setTokenFromOpen] = useState(false)
    const [tokenToOpen, setTokenToOpen]  = useState(false)
    const [settingOpen, setSettingOpen] = useState(false)
    const [tokenFrom, setTokenFrom] = useState<TokenType | undefined>(undefined)
    const [tokenTo, setTokenTo] = useState<TokenType | undefined>(undefined)
    const [swapAmount, setSwapAmount] = useState<number>(0)
    

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

    const onTokenToOpenChange = (open: boolean) => {
        setTokenToOpen(open)
    }

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
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
    const handleSwap = () => {

    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSwapAmount(Number(e.target.value))
    }

    const clear = () => {
        setTokenFrom(undefined)
        setTokenTo(undefined)
        setSwapAmount(0)
    }
    
    return (
        <div>
            <div className='font-semibold text-xl my-10  md:hidden capitalize'>{getCurrentPath()}</div>
            
                <div className='bg-zinc-900 w-full md:w-[500px] rounded-xl md:mt-10 mx-auto'>
                    <div className='pb-16 pt-1 px-10'>
                        <div className='flex justify-end items-center py-5'>
                            <div className='px-7 cursor-pointer hover:text-pink-600' onClick={clear}>Clear</div>
                            <Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>
                        </div>
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
                                <input className={`border-zinc-700 border-[1px] rounded-r-md w-3/5
                                    box-border bg-zinc-900 px-3 focus:border-pink-600
                                    ${tokenFromOpen ? 'hidden' : ''}`} 
                                    
                                    onChange={handleInputChange}></input>
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
                                        onOpenChange={onTokenToOpenChange} 
                                        closeTokenOption={closeTokenToOption}
                                        updateToken={setTokenTo}
                                    />
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <Button 
                                className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600' disabled={!tokenFrom || !tokenTo || !swapAmount}
                                onClick={isConnected ? handleSwap : openConnectModal}>{isConnected ? 'Swap' :'Connect Wallet'}</Button>
                        </div>
                    </div>
                </div>    
        </div>
    )
}

export default SwapHome