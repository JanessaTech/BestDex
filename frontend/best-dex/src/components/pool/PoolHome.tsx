'use client'

import { useState } from "react"
import SettingPopover from "../setting/SettingPopover"
import type { TokenType } from "@/lib/types"
import TokenSelection from "../token/TokenSelection"
import { isTokenSame } from "@/lib/utils"
import FeeTier from "./FeelTier"
import Slider from "./Slider"
import DepositInput from "./DepositInput"
import CurrentPrice from "./CurrentPrice"
import PriceRange from "./PriceRange"
import PossibleWarning from "./PossibleWarning"

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
    const [showWarning, setShowWarning] = useState<boolean>(true)
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
                    <div className="mb-4 flex justify-center items-center relative">
                        <span className="text-xl">Add position</span>
                        <div className="flex items-center absolute right-0">
                            <span className="cursor-pointer" onClick={handleClear}>Clear</span>
                            <SettingPopover open={isSettingOpen} onOpenChange={onSettingOpenChange}/>
                        </div>
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
                    <div className="my-8">
                        <div className="mb-1">Set price range</div>
                        <PriceRange 
                            label="lowPrice" 
                            price={lowPrice} 
                            onPriceChange={onLowPriceChange} 
                            token0={token0} 
                            token1={token1}/>
                        <PriceRange 
                            label="highPrice" 
                            price={highPrice} 
                            onPriceChange={onHighPriceChange} 
                            token0={token0} 
                            token1={token1}/>
                        <PossibleWarning show={showWarning}/>
                    </div>
                    <div className="text-xs my-8">
                        <CurrentPrice currentPrice={currentPrice} token0={token0} token1={token1}/>
                    </div>
                    <div className="my-8">
                        <Slider/>
                    </div>
                    <div className="my-8">
                        <div className="mb-1">Deposit amounts</div>
                        <div>
                            <DepositInput 
                                token={token0} 
                                tokenDepoist={token0Depoist} 
                                onTokenDepositChange={onToken0DepositChange}/>
                            <DepositInput 
                                token={token1} 
                                tokenDepoist={token1Depoist} 
                                onTokenDepositChange={onToken1DepositChange}/>   
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