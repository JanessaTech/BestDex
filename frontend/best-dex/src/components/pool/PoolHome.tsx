'use client'

import { useState } from "react"
import SettingPopover from "../setting/SettingPopover"
import type { TokenType } from "@/lib/types"
import TokenSelection from "../token/TokenSelection"
import { isTokenSame } from "@/lib/utils"
import FeeTier from "./FeelTier"

type PoolHomeProps = {}

const PoolHome: React.FC<PoolHomeProps> = () => {
    const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)
    
    const [fromToken, setFromToken] = useState<TokenType | undefined>({chainId: 1, name: 'eth', symbol: 'ETH', company: 'Ethereum', address: '0x000'})
    const [toToken, setToToken] = useState<TokenType | undefined>(undefined)
    const [isFromOpen, setIsFromOpen] = useState<boolean>(false)
    const [isToOpen, setIsToOpen] = useState<boolean>(false)
    const [tier, setTier] = useState<number>(0.30)

    const onSettingOpenChange = (open: boolean) => {
        setIsSettingOpen(open)
    }

    const handleFromTokenChange = (newToken: TokenType) => {
        if (isTokenSame(newToken, toToken)) {
            setFromToken(newToken)
            setToToken(undefined)
        } else {
            setFromToken(newToken)
            
        }
        
        setIsFromOpen(false)
    }

    const handleToTokenChange = (newToken: TokenType) => {
        if (isTokenSame(newToken, fromToken)) {
            setFromToken(newToken)
            setToToken(undefined)
        } else {
            setToToken(newToken)
        }
        setIsToOpen(false)
    }

    const onFromOpenChange = (open: boolean) => {
        setIsFromOpen(open)
    }

    const onToOpenChange = (open: boolean) => {
        setIsToOpen(open)
    }


    const handleClear = () => {
        setFromToken(undefined)
        setToToken(undefined)
    }

    const handleTierChoose = (tier: number) => {
        setTier(tier)
    }

    return (
        <div>
            <div className="font-semibold text-2xl">Pool</div>
            <div className="mt-4 w-4/5 md:w-2/3 h-[500px]
            mx-auto min-w-[300px] max-w-[600px] rounded-3xl border border-zinc-500
            bg-zinc-800 p-6">
                <div>
                    <div className="flex justify-end items-center mb-8">
                        <span className="cursor-pointer" onClick={handleClear}>Clear</span>
                        <SettingPopover open={isSettingOpen} onOpenChange={onSettingOpenChange}/>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <TokenSelection
                            isSwap={false}
                            open={isFromOpen} 
                            token={fromToken} 
                            handleTokenChange={handleFromTokenChange} 
                            onOpenChange={onFromOpenChange}/>
                        <TokenSelection 
                            isSwap={false}
                            open={isToOpen}  
                            token={toToken} 
                            handleTokenChange={handleToTokenChange} 
                            onOpenChange={onToOpenChange}/>
                    </div>
                    <div className="grid grid-cols-4 gap-1 my-4">
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
                        
                    </div>

                </div>

            </div>
            

        </div>
    )
}

export default PoolHome