"use client"

import { useState } from "react"
import { defaultNetwork } from "@/lib/constants"
import type { NetworkType, TokenType } from "@/lib/types"
import TokenSelection from "../token/TokenSelection"
import NetworkPopover from "./NetworkPopover"
import { isTokenSame } from "@/lib/utils" 
import SettingPopover from "../setting/SettingPopover"

type SwapHomeProps = {}

const SwapHome: React.FC<SwapHomeProps> = ({}) => {
    const [network, setNetwork] = useState<NetworkType>(defaultNetwork)
    const [isNetworkOpen, setIsNetworkOpen] = useState<boolean>(false)
    const [fromFontSize, setFromFontSize] = useState('base')
    const [toFontSize, setToFontSize] = useState('base')
    const [valueFrom, setValueFrom] = useState<string>('0')
    const [valueTo, setValueTo] = useState<string>('0')
    const [estimatedValueFrom, setEstimatedValueFrom] = useState<string>('123.3')
    const [estimatedValueTo, setEstimatedValueTo] = useState<string>('7823.14')
    const [fromToken, setFromToken] = useState<TokenType | undefined>({chainId: 1, name: 'eth', symbol: 'ETH', company: 'Ethereum', address: '0x000'})
    const [toToken, setToToken] = useState<TokenType | undefined>(undefined)
    const [isFromOpen, setIsFromOpen] = useState<boolean>(false)
    const [isToOpen, setIsToOpen] = useState<boolean>(false)
    const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)

    const handleNetworkChange = (network: NetworkType) => {
        setNetwork(network)
        setIsNetworkOpen(false)
    }

    const handleNetworkOpen = (open: boolean) => {
        setIsNetworkOpen(open)
    }

    const handleInputFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        updateFrom(value)
    }

    const handleInputToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        updateTo(value)
    }

    const updateFrom = (value: string) => {
        if (value.length >= 20) {
            setFromFontSize('xs')
        } else {
            setFromFontSize('base')
        }
        setValueFrom(value)
    }

    const updateTo = (value: string) => {
        if (value.length >= 20) {
            setToFontSize('xs')
        } else {
            setToFontSize('base')
        }
        setValueTo(value)
    }

    const onFromOpenChange = (open: boolean) => {
        setIsFromOpen(open)
    }
    const onToOpenChange = (open: boolean) => {
        setIsToOpen(open)
    }
    
    const onSettingOpenChange = (open: boolean) => {
        setIsSettingOpen(open)
    }

    const handleExchange = () => {
        setFromToken(toToken)
        setToToken(fromToken)
        setFromFontSize(toFontSize)
        setToFontSize(fromFontSize)
        updateFrom(valueTo.replace(/^0+/, ''))
        updateTo(valueFrom.replace(/^0+/, ''))
    }

    const handleFromTokenChange = (newToken: TokenType) => {
        if (isTokenSame(newToken, toToken)) {
            handleExchange()
        } else {
            setFromToken(newToken)
        }
        
        setIsFromOpen(false)
    }

    const handleToTokenChange = (newToken: TokenType) => {
        console.log('changeToTokenChange')
        if (isTokenSame(newToken, fromToken)) {
            handleExchange()
        } else {
            setToToken(newToken)
        }
        setIsToOpen(false)
    }

    const handleClear = () => {
        setNetwork(defaultNetwork)
        setFromFontSize('base')
        setToFontSize('base')
        setValueFrom('0')
        setEstimatedValueFrom('0')
        setValueTo('0')
        setEstimatedValueTo('0')
        setFromToken(undefined)
        setToToken(undefined)
    }

    return (
        <div>
            <div className="font-semibold text-2xl">Swap</div>
            <div className="mt-4 w-4/5 md:w-2/3 
            mx-auto min-w-[300px] max-w-[600px] rounded-3xl border border-zinc-500
            bg-zinc-800 p-6">
                <div>
                    <div className="flex justify-end items-center mb-8">
                        <span className="cursor-pointer" onClick={handleClear}>Clear</span>
                        <SettingPopover 
                            open={isSettingOpen} 
                            showCustom={true} 
                            onOpenChange={onSettingOpenChange}/>
                    </div>
                    <NetworkPopover 
                        open={isNetworkOpen} 
                        network={network} 
                        handleNetworkOpen={handleNetworkOpen} 
                        handleNetworkChange={handleNetworkChange}/>
                    <div>
                        <div>
                            <div>From</div>
                            <div className="flex">
                                <TokenSelection 
                                    isSwap={true} 
                                    open={isFromOpen} 
                                    token={fromToken} 
                                    handleTokenChange={handleFromTokenChange} 
                                    onOpenChange={onFromOpenChange}/>
                                <div className="w-full">
                                    <input
                                        id='swapFrom'
                                        name='swapFrom'
                                        type="text" 
                                        value={valueFrom}
                                        placeholder="0" 
                                        disabled={fromToken === undefined}
                                        className={`h-[60px] w-full rounded-e-lg box-border border-2 border-zinc-500
                                        pl-3 focus:border-2 focus:border-sky-500 text-${fromFontSize} text-black`}
                                        onChange={handleInputFromChange}
                                        onKeyDown={(event) => {
                                            const allow = (event?.key === 'Backspace' || event?.key === 'Delete') || typeof event?.key === 'string' && event?.key.length === 1 && event?.key >= '0' && event?.key <= '9'
                                            if (!allow) {
                                                event.preventDefault(); 
                                            }
                                        }}
                                        />
                                </div>
                            </div>
                            <div className="ml-[120px] text-zinc-300 text-sm">≈${estimatedValueFrom}</div>
                        </div>
                        <img 
                            src="/imgs/double-arrow.svg" 
                            alt="exchange value" 
                            className="rotate-90 h-[20px] cursor-pointer mx-auto my-2" onClick={handleExchange}/>
                        <div>
                            <div>To</div>
                                <div className="flex">
                                    <TokenSelection 
                                        isSwap={true} 
                                        open={isToOpen}  
                                        token={toToken} 
                                        handleTokenChange={handleToTokenChange} 
                                        onOpenChange={onToOpenChange}/>
                                    <div className="w-full">
                                        <input 
                                            id='swapTo'
                                            name='swapTo'
                                            type="text" 
                                            value={valueTo}
                                            placeholder="0" 
                                            disabled={toToken === undefined}
                                            className={`h-[60px] w-full rounded-e-lg box-border border-2 border-zinc-500
                                            pl-3 focus:border-2 focus:border-sky-500 text-${toFontSize} text-black`}
                                            onChange={handleInputToChange}
                                            onKeyDown={(event) => {
                                                const allow = (event?.key === 'Backspace' || event?.key === 'Delete') || typeof event?.key === 'string' && event?.key.length === 1 && event?.key >= '0' && event?.key <= '9'
                                                if (!allow) {
                                                    event.preventDefault(); 
                                                }
                                            }}
                                            />
                                    </div>
                                </div>
                                <div className="ml-[120px] text-zinc-300 text-sm">≈${estimatedValueTo}</div>
                        </div>
                        <div className={`my-2 ${fromToken && toToken ? '' : 'invisible'}`}>1 {toToken?.symbol} = 0.00029 {fromToken?.symbol}</div>
                        <div className="h-[45px] w-[200px] buttonEffect rounded-full my-8
                                        mx-auto grid place-items-center cursor-pointer">
                                    Collect wallet     
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SwapHome