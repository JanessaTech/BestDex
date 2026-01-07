import SVGCheck from "@/lib/svgs/svg_check";
import SVGPlusCircle from "@/lib/svgs/svg_plus_circle";
import { memo, useEffect, useState } from "react";
import { useWriteContract,
    useWaitForTransactionReceipt,
    useChainId,
    useAccount
  } from 'wagmi'
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { decodeEventLog, formatUnits } from 'viem';
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, 
    UNISWAP_V3_POSITION_MANAGER_ABI, 
    UNISWAP_V3_POSITION_MANAGER_COLLECT_LIQUIDITY_ABI } from "@/config/constants";
import { CollectFeeParamsType, LocalChainIds, TRANSACTION_TYPE, TokenType } from "@/common/types";
import logger from "@/common/Logger";
import {ChainId} from '@uniswap/sdk-core';
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { Decimal } from 'decimal.js'
import messageHelper from "@/common/internationalization/messageHelper";
import { TransactionCreateInputType } from "@/lib/client/types";
import { createTransaction } from "@/lib/client/Transaction";

type CollectFeeStepProps = {
    chainId: (ChainId | LocalChainIds)
    token0: TokenType;
    token1: TokenType;
    started: boolean;
    parsedCalldata: CollectFeeParamsType;
    handleCollectFeeSuccess: (token0Deposited: string, token1Deposited: string) => void
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    token0Deposited: string;
    token1Deposited: string;
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    token0Deposited: '',
    token1Deposited: '',
}

const CollectFeeStep: React.FC<CollectFeeStepProps> = ({chainId, started, parsedCalldata, token0, token1,
                                                        handleCollectFeeSuccess}) => {
    const {address} = useAccount()
    const {tokenPrices} = useContextUtil() as IContextUtil
    const [state, setState] = useState<StateType>(defaultState)
    const {data: hash, writeContract, isSuccess:isWriteSuccess, isPending:isWritePending, error:writeError } = useWriteContract()
    const {data: receipt, isError, error: receiptError, status: receiptStatus, refetch: refetchReceipt} = useWaitForTransactionReceipt({
        hash: hash,
        confirmations: 1,
        query: {
            enabled: false,
            gcTime: 0,  // disable cache
            staleTime: 0  // disable cache
        }
    })

    const handleCollectFee = () => {
        writeContract({
            address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS[chainId],
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'collect',
            args: [parsedCalldata],
        })
    }

    useEffect(() => {
        if (started) {
            logger.info('[CollectFeeStep] it will run handleCollectFee')
            setState({...state, isPending: true})
            handleCollectFee()
        }
    }, [started])

    useEffect(() => {
        if (hash) {
            logger.info('[CollectFeeStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                const parsed = parseReceipt()
                if (parsed) {
                    const {tokenId, recipient, amount0, amount1} = parsed
                    logger.info('[CollectFeeStep] parsed=', parsed)
                    setState({...state, 
                            isPending: false, isSuccess: true, 
                            token0Deposited: amount0, token1Deposited:amount1})
                    await logTransaction(hash, TRANSACTION_TYPE.Collect, token0, token1, amount0, amount1, tokenId.toString())
                } else {
                    logger.error('[CollectFeeStep] Failed to parse receipt')
                }
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            logger.info('[CollectFeeStep] it will handleCollectFeeSuccess in 1000 milliseconds')
            timer = setTimeout(() => {
                handleCollectFeeSuccess(state.token0Deposited,state.token1Deposited)
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(writeError || receiptError) {
            const failedReason = 'Failed to collect fee. Check your network and try again'
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [writeError, receiptError])


    const parseReceipt = () => {
        if (!receipt) return undefined
        const parsedOKLogs = (receipt.logs || []).map((log, index) => {
            try {
                const encoded = decodeEventLog({
                    abi: UNISWAP_V3_POSITION_MANAGER_COLLECT_LIQUIDITY_ABI,
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
        logger.debug('[CollectFeeStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return undefined
        if (!parsedOKLogs[0].decoded?.args) return undefined
        return {
                tokenId: parsedOKLogs[0].decoded.args.tokenId, 
                recipient: parsedOKLogs[0].decoded.args.recipient,
                amount0: formatUnits(parsedOKLogs[0].decoded.args.amount0, token0.decimal),
                amount1: formatUnits(parsedOKLogs[0].decoded.args.amount1, token1.decimal)
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

    logger.debug('[CollectFeeStep] ====== Latest state ========')
    logger.debug('[CollectFeeStep] isSuccess=', state.isSuccess, ' isPending=', state.isPending)
    logger.debug('[CollectFeeStep]', ' hash=', hash)
    logger.debug('[CollectFeeStep] writeError=', writeError)
    logger.debug('[CollectFeeStep] isWriteSuccess=', isWriteSuccess, ' isWritePending=', isWritePending)
    logger.debug('[CollectFeeStep] receipt=', receipt)
    logger.debug('[CollectFeeStep] receiptStatus=', receiptStatus)
    logger.debug('[CollectFeeStep] receiptError=', receiptError)

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${state.isPending && started? '' : 'hidden'}`}/>
                <SVGPlusCircle className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${state.isSuccess
                                                ? 'text-zinc-400'  
                                                : writeError || receiptError
                                                    ? 'text-red-600'
                                                    : 'text-pink-600'}`}>{state.isSuccess
                                                                                ? `Fee was collected` 
                                                                                :   writeError || receiptError
                                                                                    ? `Failed to collect fee`
                                                                                    : `Collecting fee`                                                   
                                                                                    }</div>
            </div>
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
    )
}

export default memo(CollectFeeStep)