"use client"

import { useState } from "react"
import { defaultNetwork } from "@/lib/constants"
import type { NetworkType, TokenType } from "@/lib/types"
import TokenSelection from "../token/TokenSelection"
import NetworkPopover from "./NetworkPopover"

type SwapHomeProps = {}

const SwapHome: React.FC<SwapHomeProps> = ({}) => {
    const [network, setNetwork] = useState<NetworkType>(defaultNetwork)
    const [isNetworkOpen, setIsNetworkOpen] = useState<boolean>(false)
    const [fromFontSize, setFromFontSize] = useState('base')
    const [toFontSize, setToFontSize] = useState('base')
    const [valueFrom, setValueFrom] = useState<number | ''>(0)
    const [estimatedValueFrom, setEstimatedValueFrom] = useState<number>(123.3)
    const [valueTo, setValueTo] = useState<number | ''>(0)
    const [estimatedValueTo, setEstimatedValueTo] = useState<number>(7823.14)
    const [fromToken, setFromToken] = useState<TokenType | undefined>({chainId: 1, name: 'eth', symbol: 'ETH', address: '1234', company:'Ethereum'})
    const [toToken, setToToken] = useState<TokenType | undefined>(undefined)
    const [isFromOpen, setIsFromOpen] = useState<boolean>(false)
    const [isToOpen, setIsToOpen] = useState<boolean>(false)

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
        setValueFrom(value === '' || value === undefined ? '' : Number(value))
    }

    const updateTo = (value: string) => {
        if (value.length >= 20) {
            setToFontSize('xs')
        } else {
            setToFontSize('base')
        }
        setValueTo(value === '' || value === undefined ? '' : Number(value))
    }

    const onFromOpenChange = (open: boolean) => {
        setIsFromOpen(open)
    }
    const onToOpenChange = (open: boolean) => {
        setIsToOpen(open)
    }

    const handleExchange = () => {
        if (valueFrom !== '' && valueTo !== '') {
            updateFrom(valueTo?.toString()) 
            updateTo(valueFrom?.toString())
        }
    }

    const changeFromTokenChange = (newToken: TokenType) => {
        console.log('changeFromTokenChange')
        console.log('newToken', newToken)
        setFromToken(newToken)
        setIsFromOpen(false)
    }

    const changeToTokenChange = (newToken: TokenType) => {
        console.log('changeToTokenChange')
        setToToken(newToken)
        setIsToOpen(false)
    }

    const handleClear = () => {
        setNetwork(defaultNetwork)
        setFromFontSize('base')
        setToFontSize('base')
        setValueFrom(0)
        setEstimatedValueFrom(0)
        setValueTo(0)
        setEstimatedValueTo(0)
        setFromToken(undefined)
        setToToken(undefined)
    }

    return (
        <div>
            <div className="font-semibold text-2xl">Swap</div>
            <div className="mt-4 w-4/5 md:w-1/2 
            mx-auto min-w-[400px] rounded-3xl border border-zinc-500
            bg-zinc-800 p-6">
                <div className="h-full">
                    <div className="flex justify-end items-center mb-8">
                        <span className="cursor-pointer" onClick={handleClear}>Clear</span>
                        <img src="/imgs/setting.svg" alt="setting" className="ml-3 cursor-pointer"/>
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
                                <TokenSelection open={isFromOpen} token={fromToken} handleTokenChange={changeFromTokenChange} onOpenChange={onFromOpenChange}/>
                                <div className="w-full">
                                    <input
                                        id='swapFrom'
                                        name='swapFrom'
                                        type="number" 
                                        value={valueFrom}
                                        placeholder="0" 
                                        min="0"
                                        className={`h-[60px] w-full rounded-e-lg box-border border-2 border-zinc-500
                                        pl-3 focus:border-2 focus:border-sky-500 text-${fromFontSize} text-black`}
                                        onChange={handleInputFromChange}
                                        onKeyDown={(event) => {
                                            if (event?.key === '-' || event?.key === '+') {
                                              event.preventDefault();
                                            }
                                        }}
                                        />
                                </div>
                            </div>
                            <div className="ml-[150px] text-zinc-300 text-sm">≈${estimatedValueFrom}</div>
                        </div>
                        <img 
                            src="/imgs/double-arrow.svg" 
                            alt="exchange value" 
                            className="rotate-90 h-[20px] cursor-pointer mx-auto my-2" onClick={handleExchange}/>
                        <div>
                            <div>To</div>
                                <div className="flex">
                                    <TokenSelection open={isToOpen}  token={toToken} handleTokenChange={changeToTokenChange} onOpenChange={onToOpenChange}/>
                                    <div className="w-full">
                                        <input 
                                            id='swapTo'
                                            name='swapTo'
                                            type="number" 
                                            value={valueTo}
                                            placeholder="0" 
                                            min="0"
                                            className={`h-[60px] w-full rounded-e-lg box-border border-2 border-zinc-500
                                            pl-3 focus:border-2 focus:border-sky-500 text-${toFontSize} text-black`}
                                            onChange={handleInputToChange}
                                            onKeyDown={(event) => {
                                                if (event?.key === '-' || event?.key === '+') {
                                                  event.preventDefault();
                                                }
                                            }}
                                            />
                                    </div>
                                </div>
                                <div className="ml-[150px] text-zinc-300 text-sm">≈${estimatedValueTo}</div>
                        </div>
                        <div className="my-2">1 DAI = 0.00029 WETH</div>
                        <div className="h-[45px] w-[200px] bg-sky-700 rounded-full my-8
                                        mx-auto grid place-items-center
                                cursor-pointer hover:bg-sky-600 active:bg-sky-500">
                                    Collect wallet     
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SwapHome