import SVGCheck from "@/lib/svgs/svg_check";
import SVGPlusCircle from "@/lib/svgs/svg_plus_circle";
import { memo, useEffect, useState } from "react";
import { useWriteContract,
    useWaitForTransactionReceipt
  } from 'wagmi'
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { decodeEventLog, formatUnits } from 'viem';
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, 
    UNISWAP_V3_POSITION_MANAGER_ABI, 
    UNISWAP_V3_POSITION_MANAGER_COLLECT_LIQUIDITY_ABI } from "@/config/constants";
import { CollectFeeParamsType, TokenType } from "@/common/types";

type CollectFeeStepProps = {
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

const CollectFeeStep: React.FC<CollectFeeStepProps> = ({started, parsedCalldata, token0, token1,
                                                        handleCollectFeeSuccess}) => {
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
            address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            abi: UNISWAP_V3_POSITION_MANAGER_ABI,
            functionName: 'collect',
            args: [parsedCalldata],
        })
    }

    useEffect(() => {
        if (started) {
            console.log('[CollectFeeStep] it will run handleCollectFee')
            setState({...state, isPending: true})
            handleCollectFee()
        }
    }, [started])

    useEffect(() => {
        if (hash) {
            console.log('[CollectFeeStep] it will fetch the receipt')
            refetchReceipt()
        }
    }, [hash])

    useEffect(() => {
        (async () => {
            if (!hash || !receipt) return
            if (receipt.status === 'success') {
                const parsedLog = parseCollectEventLog()
                console.log('[CollectFeeStep] parsedLog=', parsedLog)
                setState({...state, 
                        isPending: false, isSuccess: true, 
                        token0Deposited: parsedLog.amount0, token1Deposited: parsedLog.amount1})
            }
        })() 
    }, [receipt, hash])

    const parseCollectEventLog = () => {
        const emptyRes = {amount0: '', amount1: '',}
        if (!receipt) return emptyRes
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
        console.log('[CollectFeeStep] parsedOKLogs=', parsedOKLogs)
        if (parsedOKLogs.length === 0) return emptyRes
        if (!parsedOKLogs[0].decoded?.args) return emptyRes
        return {
            amount0: formatUnits(parsedOKLogs[0].decoded.args.amount0, token0.decimal),
            amount1: formatUnits(parsedOKLogs[0].decoded.args.amount1, token1.decimal)}
    }

    useEffect(() => {
        let timer = undefined
        if (state.isSuccess) {
            console.log('it will handleCollectFeeSuccess in 1000 milliseconds')
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

    console.log('[CollectFeeStep] ====== Latest state ========')
    console.log('[CollectFeeStep] isSuccess=', state.isSuccess, ' isPending=', state.isPending)
    console.log('[CollectFeeStep]', ' hash=', hash)
    console.log('[CollectFeeStep] writeError=', writeError)
    console.log('[CollectFeeStep] isWriteSuccess=', isWriteSuccess, ' isWritePending=', isWritePending)
    console.log('[CollectFeeStep] receipt=', receipt)
    console.log('[CollectFeeStep] receiptStatus=', receiptStatus)
    console.log('[CollectFeeStep] receiptError=', receiptError)

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