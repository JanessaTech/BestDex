'use client'

import Setting from '../common/Setting'
import { memo, useCallback, useEffect, useState } from 'react'
import TokenOption from '../common/TokenOption'
import { useAccount, useChainId} from 'wagmi'
import { toast } from 'sonner'
import FeeTier from './FeeTier'
import { Button } from '../ui/button'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import Deposit from './Deposit'
import SVGLeft from '@/lib/svgs/svg_left'
import { IContextUtil, useContextUtil } from '../providers/ContextUtilProvider'
import PositionRange from './PositionRange'
import { useUpdateSetting } from '@/config/store'
import RefreshModal from './RefreshModal'
import { fetchLatestPoolInfo } from '@/lib/client/Pool'
import { TokenType } from '@/common/types'
import { isDataStale } from '@/common/utils'
import logger from '@/common/Logger'
import { PoolInfo } from '@/lib/client/types'

type PoolHomeProps = {}
const PoolHome: React.FC<PoolHomeProps> = () => {
    const chainId = useChainId()
    const { openConnectModal } = useConnectModal()
    const { isConnected, address} = useAccount()
    const [settingOpen, setSettingOpen] = useState(false)
    const {slipage, deadline} = useUpdateSetting()
    const [token0Open, setToken0Open]  = useState(false)
    const [token1Open, setToken1Open]  = useState(false)
    const [token0, setToken0] = useState<TokenType | undefined>(undefined)
    const [token1, setToken1] = useState<TokenType | undefined>(undefined)
    const [deposit, setDeposit] = useState({amount0: '', amount1: ''})
    const [feeAmount, setFeeAmount] = useState(3000)
    const [state, setState] = useState<{step: number, isLoading: boolean, poolInfo: PoolInfo | undefined}>({step:1, isLoading: false, poolInfo: undefined})
    const [ticks, setTicks] = useState<{lower: number, cur: number, upper: number}>({lower:0, cur: 0, upper: 0})
    const [openAddPositionModal, setAddPositionModal] = useState(false)
    const [openRefreshModal, setOpenRefreshModal] = useState(false)

    const {getPoolAddress} = useContextUtil() as IContextUtil
    const isToken0Base = token0 && token1 ? token0.address.toLowerCase() < token1.address.toLowerCase() : undefined

    // in case we change network via wallet connection button
    useEffect(() => {
        setToken0(undefined)
        setToken1(undefined)
        setState({...state, step: 1})
    }, [chainId, isConnected])

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }
    const onToken0OpenChange = (open: boolean) => {
        setToken0Open(open)
    }
    const onToken1OpenChange = (open: boolean) => {
        setToken1Open(open)
    }
    const closeToken0Option = () => {
        setToken0Open(false)
    }
    const closeToken1Option = () => {
        setToken1Open(false)
    }

    const handleDepositChanges = (amount0: string, amount1: string) => {
        setDeposit({amount0: amount0, amount1: amount1})
    }
    
    const handleToken0Change = (token0: TokenType | undefined) => {
        if (token0) {
            if (token0.address === token1?.address) {
                toast.warning(`You cannot select the same token pair`)
            } else {
                setToken0(token0)
            }
        }
    }

    const handleToken1Change = (token1: TokenType | undefined) => {
        if (token1) {
            if (token1.address === token0?.address) {
                toast.warning(`You cannot select the same token pair`)
            } else {
                setToken1(token1)
            }
        }
    }

    const handleNextStep = async () => {
        if (token0 && token1) {
            try {
                setState({...state, isLoading: true})
                const poolAddress = await getPoolAddress(token0?.address!, token1?.address!, feeAmount)
                logger.debug('[PoolHome] poolAddress=', poolAddress)
                const poolInfo = await fetchLatestPoolInfo(poolAddress, chainId)
                setState({...state, isLoading: false, step: state.step + 1, poolInfo: poolInfo})
                logger.debug('[PoolHome] poolInfo=', poolInfo)
            } catch (error) {
                logger.error('[PoolHome] failed to get pool info due to:', error)
                setState({...state, isLoading: false})
                toast.warning('Failed to get the pool info, Please choose the corret feeTier and token pairs, then try again')
            }  
        } 
    }

    const handlePrevStep = () => {
        setState({...state, step: state.step - 1})
    }

    const handleFeeAmountChange = (_feeAmount: number) => {
        setFeeAmount(_feeAmount)
    }


    const clear = () => {
        setToken0(undefined)
        setToken1(undefined)
        setState({...state, step: 1})
        setDeposit({amount0: '0', amount1: '0'})
    }

    const updateTicks = useCallback((_lower: number, _cur: number, _upper: number) => {
        setTicks({lower: _lower, cur: _cur, upper: _upper})
    }, [])

    const updatePoolInfo = async () => {
        try {
            const poolAddress = await getPoolAddress(token0?.address!, token1?.address!, feeAmount)
            const poolInfo = await fetchLatestPoolInfo(poolAddress, chainId)
            if (poolInfo) {
                setState({...state, poolInfo: poolInfo})
                logger.info(`[PoolHome] Get the latest poolInfo from the pool address ${poolAddress}`)
                logger.debug('[PoolHome] poolInfo =', poolInfo)
            } else {
                logger.warn('[PoolHome] No cached poolInfo in websocket yet, try it later on...')
            }
        } catch (error) {
            logger.error('[PoolHome] Failed to update poolInfo due to:', error)
        }
    }

    /**
        We need to check if the poolInfo used by the current page is not matched in the poolInfo in websocket
        If not, refresh the page using the latest poolInfo in websocket
        Here is the place where we define what the matching means: different matching strategy has the different user experience.
        For example, we could use slot0.tick or slot.sqrtPriceX96 in UniswapV3Pool as the factor to decide the matching.
        Here is why:
        - With slot.sqrtPriceX96, it means we have the best price accuracy, however, it also means
          we would be faced with the higher chance of the bad user experience expecially for the pool with the high frequent transactons
          because we need to refresh the page frequently
        - With slot0.tick, it means we have a better user experience, but we should accept the potential risk of 
          using the stale pool data
    **/
    const checkRefresh = async () => {
        logger.info('[PoolHome] check price change')
        if (!state.poolInfo) throw new Error('No poolInfo found') //it shouldn't happen
        const poolAddress = await getPoolAddress(token0?.address!, token1?.address!, feeAmount)
        logger.debug('[PoolHome] poolAddress = ', poolAddress)
        const latestPoolInfo = await fetchLatestPoolInfo(poolAddress, chainId)
        if (!latestPoolInfo) return // it shouldn't happen after we move websockte to backend
        const isStale = isDataStale(state.poolInfo, latestPoolInfo, slipage/100)
        if (isStale) {
            logger.debug('[PoolHome] data is stale')
            setOpenRefreshModal(true)
        } else {
            setAddPositionModal(true) 
        }  
    }

    const closeAddPositionModal = () => {
        setAddPositionModal(false)
    }
    const closeRefreshModal = () => {
        setOpenRefreshModal(false)
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
                                className={`size-6 absolute left-[-10px] cursor-pointer hover:text-pink-600 ${state.step === 1 ? 'hidden' : ''}`}
                                onClick={handlePrevStep}  
                            />
                        </div>
                    </div>
                    {
                        state.step === 1 &&
                        <>
                            <div>
                                <div className='pb-2'>Select pair</div>
                                <div className='h-16 grid w-full grid-cols-2 gap-3'>
                                    <TokenOption 
                                        tokenOpen={token0Open} 
                                        chainId={chainId} 
                                        curToken={token0}
                                        onOpenChange={onToken0OpenChange} 
                                        closeTokenOption={closeToken0Option}
                                        updateToken={handleToken0Change}
                                    />
                                    <TokenOption 
                                        tokenOpen={token1Open} 
                                        chainId={chainId} 
                                        curToken={token1}
                                        onOpenChange={onToken1OpenChange} 
                                        closeTokenOption={closeToken1Option}
                                        updateToken={handleToken1Change}
                                    />
                                </div>
                            </div>
                            <FeeTier handleFeeAmountChange={handleFeeAmountChange}/>
                            <div className='pt-4'>
                                <Button 
                                    className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600' 
                                    disabled={ isConnected ? (!token0 || !token1) : false}
                                    onClick={isConnected ? handleNextStep : openConnectModal}>
                                        {isConnected 
                                            ? <div className='relative'>
                                                <div className={`size-10 border-[1px] rounded-full border-white border-t-transparent animate-spin absolute top-[-10px] ${state.isLoading ? '' : 'hidden'}`}></div>
                                                <span>Next</span>
                                               </div>
                                            :'Connect Wallet'}
                                </Button>
                            </div>
                        </>
                    }
                    {
                        state.step === 2 && 
                        <>
                            <PositionRange
                                token0={isToken0Base ? token0! : token1!} 
                                token1={isToken0Base ? token1! : token0!}
                                feeAmount={feeAmount}
                                poolInfo={state.poolInfo!}
                                updatePoolInfo={updatePoolInfo}
                                updateTicks={updateTicks}
                                />
                            <Deposit 
                                amount0={deposit.amount0}
                                amount1={deposit.amount1}
                                token0={isToken0Base ? token0! : token1!} 
                                token1={isToken0Base ? token1! : token0!}
                                poolInfo={state.poolInfo!}
                                lowerTick={ticks.lower}
                                curTick={ticks.cur}
                                upperTick={ticks.upper}
                                openAddPositionModal={openAddPositionModal}
                                closeAddPositionModal={closeAddPositionModal}
                                checkRefresh={checkRefresh}
                                handleDepositChanges={handleDepositChanges}/>
                        </>
                    }
                </div>
            </div> 
            {
                openRefreshModal && <RefreshModal closeRefreshModal={closeRefreshModal}/>
            }

        </div>
    )
}

export default memo(PoolHome)