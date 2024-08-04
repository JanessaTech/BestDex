'use client'

import { useState } from "react"
import SettingPopover from "../setting/SettingPopover"
import type { TokenType } from "@/lib/types"
import TokenSelection from "../token/TokenSelection"
import { isTokenSame } from "@/lib/utils"
import FeeTier from "./FeelTier"
import Warning from "@/lib/svgs/Warning"

type PoolHomeProps = {}

const PoolHome: React.FC<PoolHomeProps> = () => {
    const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
    
    const [token0, setToken0] = useState<TokenType | undefined>({chainId: 1, name: 'eth', symbol: 'ETH', company: 'Ethereum', address: '0x000'})
    const [token1, setToken1] = useState<TokenType | undefined>(undefined)
    const [isToken0Open, setIsToken0Open] = useState<boolean>(false)
    const [isToken1Open, setIsToken1Open] = useState<boolean>(false)
    const [tier, setTier] = useState<number>(0.30)
    const [lowPrice, setLowPrice] = useState<number | ''>(0)
    const [highPrice, setHighPrice] = useState<number | ''>(0)
    const [currentPrice, setCurrentPrice] = useState<number>(0.997)
    const [token0Depoist, setToken0Deposit] = useState<number | ''>(0)
    const [token1Depoist, setToken1Deposit] = useState<number | ''>(0)

    const onSettingOpenChange = (open: boolean) => {
        setIsSettingOpen(open)
    }

    const handleToken0Change = (newToken: TokenType) => {
        if (isTokenSame(newToken, token1)) {
            setToken0(newToken)
            setToken1(undefined)
            setLowPrice(0)
            setHighPrice(0)
            setCurrentPrice(0)
        } else {
            setToken0(newToken)
            
        }
        setIsToken0Open(false)
    }

    const handleToken1Change = (newToken: TokenType) => {
        if (isTokenSame(newToken, token0)) {
            setToken0(newToken)
            setToken1(undefined)
            setLowPrice(0)
            setHighPrice(0)
            setCurrentPrice(0)
        } else {
            setToken1(newToken)
        }
        setIsToken1Open(false)
    }

    const onToken0OpenChange = (open: boolean) => {
        setIsToken0Open(open)
    }

    const onToken1OpenChange = (open: boolean) => {
        setIsToken1Open(open)
    }


    const handleClear = () => {
        setToken0(undefined)
        setToken1(undefined)
    }

    const handleTierChoose = (tier: number) => {
        setTier(tier)
    }

    const onLowPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setLowPrice(Number(e.target.value))
        } else {
            setLowPrice('')
        }  
    }

    const onHighPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setHighPrice(Number(e.target.value))
        } else {
            setHighPrice('')
        }
    }

    const onToken0DepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setToken0Deposit(Number(e.target.value))
        } else {
            setToken0Deposit('')
        }
    }

    const onToken1DepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setToken1Deposit(Number(e.target.value))
        } else {
            setToken1Deposit('')
        }
    }

    return (
        <div>
            <div className="font-semibold text-2xl">Pool</div>
            <div className="mt-4 w-4/5 md:w-2/3
            mx-auto min-w-[300px] max-w-[600px] rounded-3xl border border-zinc-500
            bg-zinc-800 p-6">
                <div>
                    <div className="flex justify-end items-center mb-4 relative">
                        <span className="cursor-pointer" onClick={handleClear}>Clear</span>
                        <SettingPopover open={isSettingOpen} onOpenChange={onSettingOpenChange}/>
                    </div>
                    <div>
                        <div className="mb-1">Select pair</div>
                        <div className="grid grid-cols-2 gap-2">
                            <TokenSelection
                                isSwap={false}
                                open={isToken0Open} 
                                token={token0} 
                                handleTokenChange={handleToken0Change} 
                                onOpenChange={onToken0OpenChange}/>
                            <TokenSelection 
                                isSwap={false}
                                open={isToken1Open}  
                                token={token1} 
                                handleTokenChange={handleToken1Change} 
                                onOpenChange={onToken1OpenChange}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1 my-8">
                        <FeeTier 
                            content="Best for very stable pairs" 
                            tier={0.01} 
                            select={0}
                            isSelected={tier === 0.01} 
                            handleTierChoose={handleTierChoose}/>
                        <FeeTier  
                            content="Best for stable pairs" 
                            tier={0.05} 
                            select={25}
                            isSelected={tier === 0.05} 
                            handleTierChoose={handleTierChoose}/>
                        <FeeTier 
                            content="Best for most pairs" 
                            tier={0.3} 
                            select={75}
                            isSelected={tier === 0.3} 
                            handleTierChoose={handleTierChoose}/>
                        <FeeTier 
                            content="Best for exotic pairs" 
                            tier={1.00} 
                            select={0}
                            isSelected={tier === 1.00} 
                            handleTierChoose={handleTierChoose}/>
                    </div>
                    <div>
                        <div className="mb-1">Set price range</div>   
                        <div className="relative mb-2">
                            <input 
                                id='lowPrice'
                                name='lowPrice'
                                type="number" 
                                className="rounded-md h-20 w-full border border-zinc-300 
                                text-black text-lg px-3"
                                value={lowPrice}
                                onChange={onLowPriceChange}
                                placeholder="0"
                                onKeyDown={(event) => {
                                    if (event?.key === '+' || event?.key === '-') {
                                        event.preventDefault()
                                    }
                                }}
                            />
                            <span className="text-xs text-zinc-400 absolute top-1 left-3">Low price</span>
                            <span className="text-xs text-zinc-400 absolute bottom-1 left-3">
                                {token0 && token1 ? `${token1?.symbol} per ${token0?.symbol}`: `per ${token0?.symbol}`}
                            </span>
                        </div>
                        <div className="relative mb-2">
                            <input
                                id='highPrice'
                                name='highPrice'
                                type="number" 
                                className="rounded-md h-20 w-full border border-zinc-300 
                                text-black text-lg px-3"
                                value={highPrice}
                                onChange={onHighPriceChange}
                                placeholder="0"
                                onKeyDown={(event) => {
                                    if (event?.key === '+' || event?.key === '-') {
                                        event.preventDefault()
                                    }
                                }}
                            />
                            <span className="text-xs text-zinc-400 absolute top-1 left-3">Low price</span>
                            <span className="text-xs text-zinc-400 absolute bottom-1 left-3">
                                {token0 && token1 ? `${token1?.symbol} per ${token0?.symbol}`: `per ${token0?.symbol}`}
                            </span>
                        </div>
                        <div className="text-xs px-2 pl-10 text-orange-800 bg-orange-200 rounded-md relative">
                            <Warning className="absolute left-2 top-1 w-[20px] h-[20px]"/>
                            <span>Your position will not earn fees or be used in trades until the market price moves into your range.</span>
                        </div>
                    </div>
                    <div className="text-xs mt-3">
                        <div>Current price</div>
                        <div className="text-xl text-sky-500">{currentPrice}</div>
                        <div>{token0 && token1 ? `${token1?.symbol} per ${token0?.symbol}`: `per ${token0?.symbol}`}</div>
                    </div>
                    <div>Show slider here</div>
                    <div>
                        <div className="mb-1">Deposit amounts</div>
                        <div>
                            <div
                                className="rounded-md h-16 w-full border border-zinc-300
                                text-black text-lg px-3 bg-white relative mb-2">
                                    <input 
                                        id='token0Deposit'
                                        name='token0Deposit'
                                        type="number"
                                        className="w-[calc(100%-120px)] my-2"
                                        value={token0Depoist}
                                        placeholder="0"
                                        onChange={onToken0DepositChange}
                                        onKeyDown={(event) => {
                                            if (event?.key === '+' || event?.key === '-') {
                                                event.preventDefault()
                                            }
                                        }}
                                    />
                                <span className="text-zinc-400 text-sm absolute left-3 bottom-1">≈$332</span>
                                <div className={`w-[110px] h-[40px] 
                                    absolute right-3 top-[12px] rounded-full
                                    flex items-center px-2
                                    ${token0 ? 'bg-zinc-200' : 'bg-sky-500 text-sm text-white'}`}>
                                        {
                                            token0 ? 
                                            <>
                                                <img src={`/imgs/tokens/${token0?.name}.png`} width={25} height={25} alt={token0?.name}/>
                                                <span className="font-semibold ml-2 text-sm">{token0?.symbol}</span>
                                            </> : <span className="mx-auto">Select token</span>
                                        }
                                </div>
                            </div>
                            <div
                                className="rounded-md h-16 w-full border border-zinc-300
                                text-black text-lg px-3 bg-white relative">
                                    <input 
                                        id='token1Deposit'
                                        name='token1Deposit'
                                        type="number"
                                        className="w-[calc(100%-120px)] my-2"
                                        value={token1Depoist}
                                        placeholder="0"
                                        onChange={onToken1DepositChange}
                                        onKeyDown={(event) => {
                                            if (event?.key === '+' || event?.key === '-') {
                                                event.preventDefault()
                                            }
                                        }}
                                    />
                                <span className="text-zinc-400 text-sm absolute left-3 bottom-1">≈$332</span>
                                <div className={`w-[110px] h-[40px] 
                                    absolute right-3 top-[12px] rounded-full
                                    flex items-center px-2 
                                    ${token1 ? 'bg-zinc-200' : 'bg-sky-500 text-sm text-white'}`}>
                                        {
                                            token1 ? 
                                            <>
                                                <img src={`/imgs/tokens/${token1?.name}.png`} width={25} height={25} alt={token1?.name}/>
                                                <span className="font-semibold ml-2 text-sm">{token1?.symbol}</span>
                                            </> : <span className="mx-auto">Select token</span>
                                        }
                                     
                                </div>
                            </div>
                            
                        </div>

                    </div>
                    <div className="h-[45px] w-[200px] buttonEffect rounded-full my-8
                                        mx-auto grid place-items-center cursor-pointer">
                                    Add new position     
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PoolHome