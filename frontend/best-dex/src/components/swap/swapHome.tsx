"use client"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { useState } from "react"
import NetworkConnect from "../network/NetworkConnect"
import { defaultNetwork } from "@/lib/constants"
import { NetworkType } from "@/lib/types"
import Arrow from "@/lib/svgs/Arrow"

type SwapHomeProps = {}

const SwapHome: React.FC<SwapHomeProps> = () => {
    const [network, setNetwork] = useState<NetworkType>(defaultNetwork)
    const [fromFontSize, setFromFontSize] = useState('base')
    const [toFontSize, setToFontSize] = useState('base')
    const [valueFrom, setValueFrom] = useState<number>(0)
    const [estimatedValueFrom, setEstimatedValueFrom] = useState<number>(123.3)
    const [valueTo, setValueTo] = useState<number>(0)
    const [estimatedValueTo, setEstimatedValueTo] = useState<number>(7823.14)

    const handleNetworkChange = (network: NetworkType) => {
        setNetwork(network)
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
        if (!value) return
        if (value.length >= 20) {
            setFromFontSize('xs')
        } else {
            setFromFontSize('base')
        }
        setValueFrom(Number(value))
    }

    const updateTo = (value: string) => {
        if (!value) return
        if (value.length >= 20) {
            setToFontSize('xs')
        } else {
            setToFontSize('base')
        }
        setValueTo(Number(value))
    }

    const handleExchange = () => {
        const _from = valueFrom
        const _to = valueTo
        updateFrom(_to.toString()) 
        updateTo(_from.toString())
    }

    const handleTokenFrom = () => {
        console.log('handleTokenFrom')
    }

    return (
        <div>
            <div className="font-semibold text-2xl">Swap</div>
            <div className="mt-4 w-4/5 md:w-1/2 
            mx-auto min-w-[400px] h-[500px] rounded-3xl border border-zinc-500
            bg-zinc-800 p-6">
                <div className="h-full">
                    <div className="flex justify-end items-center">
                        <span className="cursor-pointer">Clear</span>
                        <img src="/imgs/setting.svg" alt="setting" className="ml-3 cursor-pointer"/>
                    </div>
                    <div className="border border-white h-[60px] mt-5 rounded-full px-5 flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <img src={`/imgs/networks/${network.name}.png`} alt={network.name} className="mr-4"/>
                            <span className="text-xl">{network.label}</span>
                        </div>
                        <Popover>
                            <PopoverTrigger>
                                <img src="/imgs/down_arrow.svg" alt="select network" className="mr-3 cursor-pointer"/>
                            </PopoverTrigger>     
                            <PopoverContent align='end' sideOffset={18}>
                                <NetworkConnect network={network} handleNetworkChange={handleNetworkChange}/>
                            </PopoverContent>
                        </Popover>   
                    </div>
                    <div>
                        <div>
                            <div>From</div>
                            <div className="flex">
                                <div className="group/from bg-white h-[60px] w-[180px] 
                                    rounded-s-lg border-2 border-zinc-500 border-e-0
                                    flex justify-between items-center cursor-pointer px-2"  onClick={handleTokenFrom}>
                                        <div className="flex items-center">
                                            <img src="/imgs/tokens/eth.png" width={25} height={25} alt="eth"/>
                                            <span className="text-zinc-600 font-semibold ml-2">ETH</span>
                                        </div>
                                        <Arrow className="h-[15px] w-[15px] text-black group-hover/from:text-sky-700"/>
                                </div>
                                <div className="w-full">
                                    <input 
                                        className={`h-[60px] w-full rounded-e-lg box-border border-2 border-zinc-500
                                        pl-3 focus:border-2 focus:border-sky-500 text-${fromFontSize} text-black`}
                                        onChange={handleInputFromChange}
                                        id='swapFrom'
                                        name='swapFrom'
                                        type="number" 
                                        value={valueFrom}
                                        placeholder="0" 
                                        min="0"
                                        />
                                </div>
                            </div>
                            <div className="ml-[130px] text-zinc-300 text-sm">≈${estimatedValueFrom}</div>
                        </div>
                        <img 
                            src="/imgs/double-arrow.svg" 
                            alt="exchange value" 
                            className="rotate-90 h-[20px] cursor-pointer mx-auto my-2" onClick={handleExchange}/>
                        <div>
                            <div>To</div>
                                <div className="flex">
                                    <div className="bg-sky-700 hover:bg-sky-600 active:bg-sky-500
                                    h-[60px] w-[180px] rounded-s-lg 
                                    border-2 border-zinc-500 border-e-0 cursor-pointer
                                    flex items-center justify-between px-2">
                                        <span className="font-semibold">Select token</span>
                                        <Arrow className="h-[15px] w-[15px] text-white"/>
                                    </div>
                                    <div className="w-full">
                                        <input 
                                            className={`h-[60px] w-full rounded-e-lg box-border border-2 border-zinc-500
                                            pl-3 focus:border-2 focus:border-sky-500 text-${toFontSize} text-black`}
                                            onChange={handleInputToChange}
                                            id='swapTo'
                                            name='swapTo'
                                            type="number" 
                                            value={valueTo}
                                            placeholder="0" 
                                            min="0"
                                            />
                                    </div>
                                </div>
                                <div className="ml-[130px] text-zinc-300 text-sm">≈${estimatedValueTo}</div>
                        </div>
                        <div>
                            <div className="h-[45px] w-[200px] bg-sky-700 rounded-full m-auto 
                                cursor-pointer hover:bg-sky-600 active:bg-sky-700">Collect wallet</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SwapHome