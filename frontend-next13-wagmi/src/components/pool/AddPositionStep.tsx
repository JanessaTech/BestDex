import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"
import SVGPlusCircle from "@/lib/svgs/svg_plus_circle"
import { useWriteContract,
         useWaitForTransactionReceipt,
         useAccount,
         useChainId
       } from 'wagmi'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI, UNISWAP_V3_POSITION_MANAGER_INCREASE_LIQUIDITY_ABI } from "@/config/constants"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"
import { Decimal } from 'decimal.js'
import { decodeEventLog, formatUnits} from 'viem';
import { LocalChainIds, MintPositionParamsType, TRANSACTION_TYPE, TokenType } from "@/common/types"
import logger from "@/common/Logger"
import { TransactionCreateInputType } from "@/lib/client/types"
import messageHelper from "@/common/internationalization/messageHelper"
import { createTransaction } from "@/lib/client/Transaction"
import {ChainId} from '@uniswap/sdk-core';

type AddPositionStepProps = {
    chainId: (ChainId | LocalChainIds)
    token0: TokenType;
    token1: TokenType;
    started: boolean;
    parsedCalldata: MintPositionParamsType,
    handleAddLiquiditySuccess: (positionId: bigint, token0Deposited: string, token1Deposited: string) => void;
}
type StateType = {
    reason: string;
    isSuccess: boolean;
    isPending: boolean;
    token0Deposited: string;
    token1Deposited: string;
    positionId: bigint;
}
const defaultState: StateType = {
    reason: '',
    isSuccess: false,
    isPending: true,
    token0Deposited: '',
    token1Deposited: '',
    positionId: BigInt(-1)
}

const AddPositionStep:React.FC<AddPositionStepProps> = ({chainId, started, parsedCalldata, token0, token1,
                                                        handleAddLiquiditySuccess}) => {
    const [state, setState] = useState<StateType>(defaultState)
    const {address} = useAccount()
    const {tokenPrices} = useContextUtil() as IContextUtil
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

    useEffect(() => {
        if (started) {
            logger.info('[AddPositionStep] it will run handleAddPosition')
            setState({...state, isPending: true})
            handleAddPosition()
        }
    }, [started])

    useEffect(() => {
        if (hash) {
            logger.info('[AddPositionStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                logger.info('[AddPositionStep] A new position is added')
                const parsed = parseReceipt()
                if (parsed) {
                    const {tokenId, liquidity, amount0, amount1} = parsed
                    logger.info('[AddPositionStep] parsed=', parsed)
                    setState({...state, isPending: false, isSuccess: true, positionId: tokenId, token0Deposited: amount0, token1Deposited: amount1})
                    await logTransaction(hash, TRANSACTION_TYPE.Mint, token0, token1, amount0, amount1, tokenId.toString())
                } else {
                    logger.error('[AddPositionStep] Failed to parse receipt')
                }
            }
        })() 
    }, [receipt, hash])

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            logger.info('[AddPositionStep] it will handleAddSuccess in 1000 milliseconds')
            timer = setTimeout(() => {
                handleAddLiquiditySuccess(state.positionId, state.token0Deposited,state.token1Deposited)
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [state.isSuccess])

    useEffect(() => {
        if(writeError || receiptError) {
            const failedReason = 'Failed to add a new position. Check your network or your account if it has enough currencies'
            setState({...state, isPending: false, isSuccess: false, reason: failedReason})
        }
    }, [writeError, receiptError])

    const handleAddPosition = () => {
        writeContract({
            address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS[chainId],
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'mint',
            args: [parsedCalldata],
        })
    }

    const parseReceipt = () => {
        if (!receipt) return undefined
        const parsedOKLogs = (receipt.logs || []).map((log, index) => {
            try {
                const encoded = decodeEventLog({
                    abi: UNISWAP_V3_POSITION_MANAGER_INCREASE_LIQUIDITY_ABI,
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
        logger.debug('[AddPositionStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return undefined
        if (!parsedOKLogs[0].decoded?.args) return undefined
        return {
                tokenId: parsedOKLogs[0].decoded.args.tokenId, 
                liquidity: parsedOKLogs[0].decoded.args.liquidity,
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
                amount0: '-' + amount0,
                amount1: '-' +amount1,
                usd: '-' + usd,
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
    
    logger.debug('[AddPositionStep] ====== Latest state ========')
    logger.debug('[AddPositionStep] isSuccess=', state.isSuccess, ' isPending=', state.isPending)
    logger.debug('[AddPositionStep]', ' hash=', hash)
    logger.debug('[AddPositionStep] writeError=', writeError)
    logger.debug('[AddPositionStep] isWriteSuccess=', isWriteSuccess, ' isWritePending=', isWritePending)
    logger.debug('[AddPositionStep] receipt=', receipt)
    logger.debug('[AddPositionStep] receiptStatus=', receiptStatus)
    logger.debug('[AddPositionStep] receiptError=', receiptError)
    
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
                                                                                ? `A new position was added` 
                                                                                :   writeError || receiptError
                                                                                    ? `Failed to add a new postion`
                                                                                    : `Adding a new postion`                                                   
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

export default AddPositionStep