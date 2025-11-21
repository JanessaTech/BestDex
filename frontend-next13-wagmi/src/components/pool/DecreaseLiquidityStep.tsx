
import SVGCheck from "@/lib/svgs/svg_check";
import SVGCheckCircle from "@/lib/svgs/svg_check_circle";
import { memo, useEffect, useState } from "react";
import { useSendTransaction, 
    useWaitForTransactionReceipt,
    useChainId,
    useAccount
    } from 'wagmi'
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { decodeEventLog, formatUnits } from 'viem';
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, 
    UNISWAP_V3_POSITION_MANAGER_DECREASE_LIQUIDITY_ABI, 
    } from "@/config/constants";
import { LocalChainIds, TRANSACTION_TYPE, TokenType } from "@/common/types";
import logger from "@/common/Logger";
import {ChainId} from '@uniswap/sdk-core';
import { Decimal } from 'decimal.js'
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import messageHelper from "@/common/internationalization/messageHelper";
import { TransactionCreateInputType } from "@/lib/client/types";
import { createTransaction } from "@/lib/client/Transaction";

type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    token0Deposited: string;
    token1Deposited: string;
    removedLiquidity: string;
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    token0Deposited: '',
    token1Deposited: '',
    removedLiquidity: ''
}

type DecreaseLiquidityStepProps = {
    token0: TokenType;
    token1: TokenType;
    started: boolean;
    calldata: `0x${string}`;
    handleDecreaseLiquiditySuccess:(token0Deposited: string, token1Deposited: string) => void
}
const DecreaseLiquidityStep: React.FC<DecreaseLiquidityStepProps> = ({started, token0, token1, calldata,
                                                                    handleDecreaseLiquiditySuccess}) => {
    const chainId = useChainId() as (ChainId | LocalChainIds)
    const {address} = useAccount()
    const {tokenPrices} = useContextUtil() as IContextUtil
    const [state, setState] = useState<StateType>(defaultState)
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
        sendTransaction({
            to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            data: calldata,
        })
    }

    useEffect(() => {
        (async () => {
            if (started) {
                logger.info('[DecreaseLiquidityStep] it will send the transaction for decreasing liquidity tx')
                setState({...state, isPending: true})
                await handleSendTransation()  
            }
        })()
        
    }, [started])

    useEffect(() => {
        if (hash) {
            logger.info('[DecreaseLiquidityStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                logger.info('[DecreaseLiquidityStep] Liquidity is decreased successful')
                const parsed = parseReceipt()
                if (parsed) {
                    const {tokenId, liquidity, amount0, amount1} = parsed
                    logger.info('[DecreaseLiquidityStep] parsed=', parsed)
                    setState({...state, 
                        isPending: false, isSuccess: true, 
                        token0Deposited: amount0, token1Deposited: amount1
                        })
                    await logTransaction(tokenId.toString(), hash, TRANSACTION_TYPE.Decrease, token0, token1, amount0, amount1)
                } else {
                    logger.error('[DecreaseLiquidityStep] Failed to parse receipt')
                }
                
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            timer = setTimeout(() => {
                handleDecreaseLiquiditySuccess(state.token0Deposited, state.token1Deposited)
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(sendError || receiptError) {
            const failedReason = 'Failed to decrease liquidity. Choose a different slippage and try again '
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [sendError, receiptError])

    const parseReceipt = () => {
        if (!receipt) return undefined
        const parsedOKLogs = (receipt.logs || []).map((log, index) => {
            try {
                const encoded = decodeEventLog({
                    abi: UNISWAP_V3_POSITION_MANAGER_DECREASE_LIQUIDITY_ABI,
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
        logger.debug('[DecreaseLiquidityStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return undefined
        if (!parsedOKLogs[0].decoded?.args) return undefined
        return {
                tokenId: parsedOKLogs[0].decoded.args.tokenId, 
                liquidity: parsedOKLogs[0].decoded.args.liquidity,
                amount0: formatUnits(parsedOKLogs[0].decoded.args.amount0, token0.decimal),
                amount1: formatUnits(parsedOKLogs[0].decoded.args.amount1, token1.decimal)
            }
    }

    const logTransaction = async (tokenId: string, hash: `0x${string}`, txType: string, token0: TokenType,
        token1: TokenType, amount0: string, amount1: string) => {
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
        const price0 = tokenPrices[targetChainId]?.get(token0.address)
        const price1 = tokenPrices[targetChainId]?.get(token1.address)
        if (!price0) throw new Error(`Failed to get price for token0 ${token0.address}`)
        if (!price1) throw new Error(`Failed to get price for token1 ${token1.address}`)
        let token0USD = new Decimal(price0).times(new Decimal(amount0))
        let token1USD = new Decimal(price1).times(new Decimal(amount1))
        logger.debug(`${amount0} amount of token0 = ${token0USD.toString()} usd`)
        logger.debug(`${amount1} amount of token1 = ${token1USD.toString()} usd`)
        const sum = new Decimal(0).add(token0USD).add(token1USD).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        return sum
    }

     // output debug info
     logger.debug('[DecreaseLiquidityStep] ====== Latest state ========')
     logger.debug('[DecreaseLiquidityStep] state=', state)
     logger.debug('[DecreaseLiquidityStep] hash =', hash)
     logger.debug('[DecreaseLiquidityStep] isPending =', isPending, ' isSuccess =', isSuccess, '  sendError =', sendError)
     logger.debug('[DecreaseLiquidityStep] isReceiptError =', isReceiptError)
     logger.debug('[DecreaseLiquidityStep] receiptStatus =', receiptStatus)
     logger.debug('[DecreaseLiquidityStep] receiptError =', receiptError)
     logger.debug('[DecreaseLiquidityStep] receipt =', receipt)

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
                                                                                            ? 'The liquidity was decreased'
                                                                                            : sendError || receiptError
                                                                                                ? 'Failed to decrease liquidity'
                                                                                                : 'Decreasing liquidity'}</div>
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

export default memo(DecreaseLiquidityStep)