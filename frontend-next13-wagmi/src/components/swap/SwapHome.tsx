'use client'

import { useChainId, useSwitchChain} from 'wagmi'
import { IContextUtil, useContextUtil } from '../providers/ContextUtilProvider'
import NetworkOption from '../common/NetworkOption'
import { useEffect, useState } from 'react'
import TokenOption from '../common/TokenOption'
import { TokenType } from '@/lib/types'
import ArrowUpDown from '@/lib/svgs/svg_arrow_updown'
import { Button } from "@/components/ui/button"
import Setting from '../common/Setting'
import { toast } from "sonner"
import SwapInput from './SwapInput'
import SVGLeft from '@/lib/svgs/svg_left'
import Quotes from './Quotes'
import { useUpdateSetting } from '@/config/store'
import { ChainId } from '@uniswap/sdk-core'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()
    const chainId = useChainId() as ChainId
    const curChain = chains.filter((c) => c.id === chainId)[0]
    const {tokenPrices} = useContextUtil() as IContextUtil
    const [networkOpen, setNetworkOpen] = useState(false)
    const [tokenFromOpen, setTokenFromOpen] = useState(false)
    const [tokenToOpen, setTokenToOpen]  = useState(false)
    const [settingOpen, setSettingOpen] = useState(false)
    const [tokenFrom, setTokenFrom] = useState<TokenType | undefined>(undefined)
    const [tokenTo, setTokenTo] = useState<TokenType | undefined>(undefined)
    const [swapAmount, setSwapAmount] = useState('')
    const [step, setStep] = useState(1)
    const {slipage, deadline} = useUpdateSetting()

    console.log('Price is : ', tokenPrices[chainId]?.get('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'))

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

    const handleTokenFromChange = (from: TokenType | undefined) => {
        if (from) {
            if (from.address === tokenTo?.address) {
                toast.warning(`You cannot select the same token pair`)
            } else {
                setTokenFrom(from)
            }
        }
    }

    const handleTokenToChange = (to: TokenType | undefined) => {
        if (to) {
            if (to.address === tokenFrom?.address) {
                toast.warning(`You cannot select the same token pair`)
            } else {
                setTokenTo(to)
            }
        }
    }

    const exChangeTokens = () => {
        const from = tokenFrom
        const to = tokenTo
        setTokenFrom(to)
        setTokenTo(from)
    }
    

    const handleInputChange = (value: string) => {
        setSwapAmount(value)
    }

    const clear = () => {
        setTokenFrom(undefined)
        setTokenTo(undefined)
        setSwapAmount('')
        setStep(1)
    }
    const handlePrevStep = () => {
        setStep(step - 1)
    }

    const handleGetQuotes = () => {
        setStep(step + 1)
    }
    
    return (
        <div>
            <div className='font-semibold text-xl my-10  md:hidden capitalize'>Swap</div>
            
                <div className='bg-zinc-900 w-full md:w-[500px] rounded-xl md:mt-10 mx-auto'>
                    <div className='pb-16 pt-1 px-10'>
                        <div className='flex justify-end items-center py-5 relative'>
                            <div>
                                <SVGLeft
                                        className={`size-6 absolute left-0 top-5 cursor-pointer hover:text-pink-600 ${step === 1 ? 'hidden' : ''}`}
                                        onClick={handlePrevStep} />
                            </div>
                            <div className='flex justify-end items-center'>
                                <div className='px-7 cursor-pointer hover:text-pink-600' onClick={clear}>Clear</div>
                                <Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>
                            </div>
                        </div>
                        {
                            step === 1 &&
                            <>
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
                                            updateToken={handleTokenFromChange}
                                            />

                                        <SwapInput amount={swapAmount} hidden={tokenFromOpen} onChange={handleInputChange}/>
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
                                                updateToken={handleTokenToChange}
                                            />
                                    </div>
                                </div>
                                <div className='flex justify-center'>
                                    <Button 
                                        className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600'
                                        disabled={!tokenFrom || !tokenTo || !swapAmount}
                                        onClick={handleGetQuotes}
                                        >
                                        Get Quotes
                                    </Button>
                                </div>
                            </>
                        }
                        {
                            step === 2 &&
                            <>
                             {tokenFrom && tokenTo && <Quotes 
                                                        tokenFrom={tokenFrom} 
                                                        tokenTo={tokenTo} 
                                                        swapAmount={Number(swapAmount)} 
                                                        setting={{slipage: slipage, deadline: deadline}}
                                                        handlePrevStep={handlePrevStep}/>}
                            </>
                        }
                        
                    </div>
                </div>    
        </div>
    )
}

export default SwapHome