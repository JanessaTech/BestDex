import SVGCheck from "@/lib/svgs/svg_check"
import SVGCheckCircle from "@/lib/svgs/svg_check_circle"
import { useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useSendTransaction, 
         useWaitForTransactionReceipt,
         useAccount,
         useChainId } from 'wagmi'
import {WaitForTransactionReceiptErrorType} from "@wagmi/core"
import { UNISWAP_ERRORS, UNISWAP_V3_POOL_SWAP_ABI, V3_SWAP_ROUTER_ADDRESS } from "@/config/constants"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"
import { Decimal } from 'decimal.js'
import { LocalChainIds, TRANSACTION_TYPE, TokenType } from "@/common/types"
import logger from "@/common/Logger"
import { decodeEventLog, formatUnits} from 'viem';
import {ChainId} from '@uniswap/sdk-core';
import messageHelper from "@/common/internationalization/messageHelper"
import { TransactionCreateInputType } from "@/lib/client/types"
import { createTransaction } from "@/lib/client/Transaction"

const getFailedReason = (simulationError: WaitForTransactionReceiptErrorType): string => {
    const defaultReason = 'Unknown reason'
    if (simulationError?.cause) {
        const reason = (simulationError?.cause as any)?.reason
        const translatedReason = UNISWAP_ERRORS[reason] || defaultReason
        return (simulationError as any)?.shortMessage  || simulationError.message || translatedReason
    }
    return defaultReason
}

type SwapStepProps = {
    started: boolean;
    tokenFrom: TokenType;
    tokenTo: TokenType;
    calldata: `0x${string}`;
    handleSwapSuccess: (swapOut: string) => void
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    preBalance: string;
    actualOutput: string
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    preBalance: '',
    actualOutput: ''
}
const SwapStep:React.FC<SwapStepProps> = ({started, tokenFrom, tokenTo, calldata, handleSwapSuccess}) => {
    const {address} = useAccount()
    const chainId = useChainId() as (ChainId | LocalChainIds)
    const [state, setState] = useState<StateType>(defaultState)
    const {getTokenBalance, tokenPrices} = useContextUtil() as IContextUtil
    const isTokenFromToken0 = tokenFrom.address.toLowerCase() < tokenTo.address.toLowerCase()

    logger.debug('[SwapStep] isTokenFromToken0=', isTokenFromToken0)

    const {data: hash, isPending, isSuccess, error:sendError, sendTransaction} = useSendTransaction()
    const {data: receipt, isError: isReceiptError, error: receiptError, status: receiptStatus, refetch: refetchReceipt} = useWaitForTransactionReceipt({
        hash: hash,
        confirmations: 1,
        query: {
            enabled: false,
            gcTime: 0,  // disable cache
            staleTime: 0  // disable cache
        }
    })

    const handleSendTransation = async () => {
        const balance = await getTokenBalance(tokenTo.address, address!, {decimals: tokenTo.decimal})
        setState({...state, preBalance: balance})
        logger.debug('[SwapStep] pre balance: ',  balance, ' for ', tokenTo.address)
        sendTransaction({
            to: V3_SWAP_ROUTER_ADDRESS,
            data: calldata,
        })
    }

    useEffect(() => {
        (async () => {
            if (started) {
                logger.info('[SwapStep] it will send swap tx')
                setState({...state, isPending: true})
                await handleSendTransation()  
            }
        })()
        
    }, [started])

    useEffect(() => {
        if (hash) {
            logger.info('[SwapStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                logger.info('[SwapStep] swap is successful')
                const balance = await getTokenBalance(tokenTo.address, address!, {decimals: tokenTo.decimal})
                const inc = new Decimal(balance).minus(new Decimal(state.preBalance)).toDecimalPlaces(4, Decimal.ROUND_HALF_UP).toString()
                setState({...state, isPending: false, isSuccess: true, actualOutput: inc})
                const parsed = parseReceipt()
                if (parsed) {
                    const {sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick} = parsed
                    logger.info('[SwapStep] parsed=', parsed)
                    await logTransaction(hash, TRANSACTION_TYPE.Swap, isTokenFromToken0 ? tokenFrom: tokenTo, isTokenFromToken0 ? tokenTo: tokenFrom, amount0, amount1, undefined)
                } else {
                    logger.error('[SwapStep] Failed to parse receipt')
                }
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            timer = setTimeout(() => {handleSwapSuccess(state.actualOutput)}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(sendError || receiptError) {
            //const failedReason = getFailedReason(receiptError) 
            const failedReason = 'Failed to swap. Check your network or your account if it has enough currencies'
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [sendError, receiptError])

    const parseReceipt = () => {
        if (!receipt) return undefined
        const parsedOKLogs = (receipt.logs || []).map((log, index) => {
            try {
                const encoded = decodeEventLog({
                    abi: UNISWAP_V3_POOL_SWAP_ABI,
                    data: log.data,
                    topics: log.topics
                })
                return {
                    ...log,
                    decoded: encoded,
                    ok: true
                }
            } catch (error: any) {
                return {
                    ...log,
                    decoded: undefined,
                    ok: false,
                    error: error?.message
                }
            }
        }).filter((log) => log.ok)
        logger.debug('[SwapStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return undefined
        if (!parsedOKLogs[0].decoded?.args) return undefined
        return {
                sender: parsedOKLogs[0].decoded?.args.sender,
                recipient: parsedOKLogs[0].decoded?.args.recipient,
                amount0: formatUnits(parsedOKLogs[0].decoded?.args.amount0, isTokenFromToken0 ? tokenFrom.decimal: tokenTo.decimal),
                amount1: formatUnits(parsedOKLogs[0].decoded?.args.amount1, isTokenFromToken0 ? tokenTo.decimal: tokenFrom.decimal),
                sqrtPriceX96:  parsedOKLogs[0].decoded?.args.sqrtPriceX96,
                liquidity:  parsedOKLogs[0].decoded?.args.liquidity,
                tick: parsedOKLogs[0].decoded?.args.tick,
            }
    }

    const logTransaction = async (hash: `0x${string}`, txType: string, token0: TokenType,
        token1: TokenType, amount0: string, amount1: string, tokenId?: string) => {
        try {
            if (!address) {
                const message = messageHelper.getMessage('transaction_create_missing_from', txType, chainId, tokenId, hash, token0.address, token1.address, amount0, amount1)
                throw Error(message)
            }
            const usd = calcUSD(amount0, amount1)
            const params: TransactionCreateInputType = {
                chainId: chainId,
                tokenId: tokenId,
                tx: hash,
                token0: token0.address,
                token1: token1.address,
                txType: txType,
                amount0: amount0,
                amount1: amount1,
                usd: usd,
                from: address
            }
            const createdTx = await createTransaction(params)
            logger.debug('A new transaction is logged:', createdTx)
        } catch(error) {
            logger.error('Failed to log a new transaction due to:', error)
        }
    }

    const calcUSD = (amount0: string, amount1: string) => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test
        const price0 = tokenPrices[targetChainId]?.get(tokenFrom.address)
        const price1 = tokenPrices[targetChainId]?.get(tokenTo.address)
        if (!price0) throw new Error(`Failed to get price for token0 ${tokenFrom.address}`)
        if (!price1) throw new Error(`Failed to get price for token1 ${tokenTo.address}`)
        let token0USD = new Decimal(price0).times(new Decimal(amount0))
        let token1USD = new Decimal(price1).times(new Decimal(amount1))
        logger.debug(`${amount0} amount of token0 = ${token0USD.toString()} usd`)
        logger.debug(`${amount1} amount of token1 = ${token1USD.toString()} usd`)
        const sum = new Decimal(0).add(token0USD).add(token1USD).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        return sum
    }

    // output debug info
    logger.info('[SwapStep] ====== Latest state ========')
    logger.info('[SwapStep] state=', state)
    logger.info('[SwapStep] hash =', hash)
    logger.info('[SwapStep] isPending =', isPending, ' isSuccess =', isSuccess, '  sendError =', sendError)
    logger.info('[SwapStep] isReceiptError =', isReceiptError)
    logger.info('[SwapStep] receiptStatus =', receiptStatus)
    logger.info('[SwapStep] receiptError =', receiptError)
    logger.info('[SwapStep] receipt =', receipt)

    return (
        <div className="flex justify-between items-center">
                <div className="flex items-center relative">
                    <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${state.isPending && started ? '' : 'hidden'}`}/>
                    <SVGCheckCircle className="text-white size-5 ml-[2px]"/>
                    <div className={`text-xs pl-3 ${ state.isSuccess
                                                            ? 'text-zinc-400'
                                                            : sendError || receiptError
                                                                ? 'text-red-600'
                                                                : 'text-pink-600'}`}>{state.isSuccess
                                                                                            ? 'Confirmed swap'
                                                                                            : sendError || receiptError
                                                                                                ? 'Failed to swap'
                                                                                                : 'Confirm swap in wallet'}</div>
                </div>
                <div>
                    {
                        state.isPending
                        ? <></>
                        : state.isSuccess
                            ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                            : <ToolTipHelper content={<div className="w-80">{state.reason}</div>}>
                                <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                              </ToolTipHelper>
                        
                    }  
                </div>
        </div>  
    )
}

export default SwapStep