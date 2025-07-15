'use client'

import Setting from '../common/Setting'
import { useEffect, useState } from 'react'
import TokenOption from '../common/TokenOption'
import { useAccount, useChainId } from 'wagmi'
import { TokenType } from '@/lib/types'
import { toast } from 'sonner'
import FeeTier from './FeeTier'
import PriceRange from './PriceRange'
import { Button } from '../ui/button'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Deposit from './Deposit'
import SVGLeft from '@/lib/svgs/svg_left'

type PoolHomeProps = {}
const PoolHome: React.FC<PoolHomeProps> = () => {
    const chainId = useChainId()
    const { openConnectModal } = useConnectModal()
    const { isConnected } = useAccount()
    const [settingOpen, setSettingOpen] = useState(false)
    const [token1Open, setToken1Open]  = useState(false)
    const [token2Open, setToken2Open]  = useState(false)
    const [token1, setToken1] = useState<TokenType | undefined>(undefined)
    const [token2, setToken2] = useState<TokenType | undefined>(undefined)
    const [deposit, setDeposit] = useState({amount1: '0', amount2: '0'})
    const [step, setStep] = useState(1)
    
    // in case we change network via wallet connection button
    useEffect(() => {
        setToken1(undefined)
        setToken2(undefined)
        setStep(1)
    }, [chainId, isConnected])

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }
    const onToken1OpenChange = (open: boolean) => {
        setToken1Open(open)
    }
    const onToken2OpenChange = (open: boolean) => {
        setToken2Open(open)
    }
    const closeToken1Option = () => {
        setToken1Open(false)
    }
    const closeToken2Option = () => {
        setToken2Open(false)
    }

    const handleDepositToken1Change = (value: string) => {
        setDeposit({...deposit, amount1: value})
    }
    const handleDepositToken2Change = (value: string) => {
        setDeposit({...deposit, amount2: value})
    }
    
    const handleToken1Change = (token1: TokenType | undefined) => {
        if (token1) {
            if (token1.address === token2?.address) {
                toast.warning(`You cannot select the same token pair`)
            } else {
                setToken1(token1)
            }
        }
    }

    const handleToken2Change = (token2: TokenType | undefined) => {
        if (token2) {
            if (token2.address === token1?.address) {
                toast.warning(`You cannot select the same token pair`)
            } else {
                setToken2(token2)
            }
        }
    }

    const handleNextStep = () => {
        setStep(step + 1)
    }

    const handlePrevStep = () => {
        setStep(step - 1)
    }


    const clear = () => {
        setToken1(undefined)
        setToken2(undefined)
        setDeposit({amount1: '0', amount2: '0'})
    }
 
    return (
        <div>
            <div className='font-semibold text-xl my-10 md:hidden capitalize'>Pool</div>
            <div className='bg-zinc-900 w-full md:w-[500px] rounded-xl md:mt-10 mx-auto'>
                <div className='pb-16 pt-1 px-10'>
                    <div className='py-5 flex justify-center relative'>
                        <div className='font-semibold'>Add position</div>
                        <div className='flex justify-end items-center absolute right-0'>
                            <div className='px-7 cursor-pointer hover:text-pink-600 hidden md:block' onClick={clear}>Clear</div>
                            <Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>
                        </div>
                        <div>
                            <SVGLeft 
                                className={`size-6 absolute left-[-10px] cursor-pointer hover:text-pink-600 ${step === 1 ? 'hidden' : ''}`}
                                onClick={handlePrevStep}  
                            />
                        </div>
                    </div>
                    {
                        step === 1 &&
                        <>
                            <div>
                                <div className='pb-2'>Select pair</div>
                                <div className='h-16 grid w-full grid-cols-2 gap-3'>
                                    <TokenOption 
                                        tokenOpen={token1Open} 
                                        chainId={chainId} 
                                        curToken={token1}
                                        onOpenChange={onToken1OpenChange} 
                                        closeTokenOption={closeToken1Option}
                                        updateToken={handleToken1Change}
                                    />
                                    <TokenOption 
                                        tokenOpen={token2Open} 
                                        chainId={chainId} 
                                        curToken={token2}
                                        onOpenChange={onToken2OpenChange} 
                                        closeTokenOption={closeToken2Option}
                                        updateToken={handleToken2Change}
                                    />
                                </div>
                            </div>
                            <FeeTier/>
                        </>
                    }
                    {
                        step === 2 && 
                        <>
                            <PriceRange token1={token1} token2={token2}/>
                            <Deposit 
                                amount1={deposit.amount1}
                                amount2={deposit.amount2}
                                token1={token1} 
                                token2={token2} 
                                handleDepositToken1Change={handleDepositToken1Change} 
                                handleDepositToken2Change={handleDepositToken2Change} />
                        </>
                    }
                    <div className='pt-8'>
                        <Button 
                            className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600' 
                            disabled={ isConnected ? (!token1 || !token2) : false}
                            onClick={isConnected ? handleNextStep : openConnectModal}>
                                {isConnected 
                                    ? step === 1 ? 'Next' : 'New Position'
                                    :'Connect Wallet'}
                        </Button>
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default PoolHome