import SVGCheck from "@/lib/svgs/svg_check"
import SVGSign from "@/lib/svgs/svg_sign"
import { memo, useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useSimulateContract,} from "wagmi"
import {SimulateContractErrorType} from "@wagmi/core"
import {decodeFunctionData} from 'viem'
import { SwapRouter02ABI, UNISWAP_ERRORS, V3_SWAP_ROUTER_ADDRESS } from "@/config/constants"
import logger from "@/common/Logger"
import {ChainId} from '@uniswap/sdk-core';
import { LocalChainIds } from "@/common/types"

const parseCalldata = (calldata: `0x${string}`) => {
    try {
        logger.debug('[SimulateSwapStep] calldata=', calldata)
        const decoded = decodeFunctionData({
            abi: SwapRouter02ABI,
            data: calldata
        })
        let deadline = undefined
        let innerCalls = undefined
        if (decoded && decoded.args &&  decoded.args.length >= 2) {
            deadline = decoded.args[0]
            innerCalls = decoded?.args[1]
        }
        logger.debug('[SimulateSwapStep] deadline=', deadline)
        logger.debug('[SimulateSwapStep] innerCalls=', innerCalls)
        return {deadline, innerCalls}
    } catch(err) {
        logger.error('[SimulateSwapStep] failed to parse calldata due to:', err)
    }
    return {deadline: undefined, innerCalls: undefined}
}

const getFailedReason = (simulationError: SimulateContractErrorType): string => {
    const defaultReason = 'Unknown reason'
    if (simulationError?.cause) {
        const reason = (simulationError?.cause as any)?.reason
        const translatedReason = UNISWAP_ERRORS[reason] || defaultReason
        return (simulationError as any)?.shortMessage  || simulationError.message || translatedReason
    }
    return defaultReason
}

type SimulateSwapStepProps = {
    chainId: (ChainId | LocalChainIds);
    started: boolean;
    done: boolean;
    skip: boolean; // for test
    calldata: `0x${string}`;
    goNext: () => void
}
const SimulateSwapStep:React.FC<SimulateSwapStepProps> = ({chainId, started, skip, done, calldata, goNext}) => {
    const {deadline, innerCalls} = parseCalldata(calldata)
    if (!deadline || !innerCalls) return <div>Failed to parse calldata</div>
    const [reason, setReason] = useState('')

    const { data: simulation, error: simulationError, isPending, isFetching, isSuccess, refetch:refetchSimulation} = useSimulateContract({
        address: V3_SWAP_ROUTER_ADDRESS[chainId],
        abi: SwapRouter02ABI,
        functionName: 'multicall',
        args: [deadline, innerCalls],
        query: {
            enabled: false,  // run refetchSimulation manually
            gcTime: 0,  // disable cache
            staleTime: 0  // disable cache
        }
    })

    useEffect(() => {
        let timer = undefined
        if (started) {
            if (skip) {
                logger.info('[SimulateSwapStep] skip SimulateSwapStep')
                goNext()
                return
            }
            logger.info('[SimulateSwapStep] it will run refetchSimulation in 1000 milliseconds')
            timer = setTimeout(() => {
                logger.info('[SimulateSwapStep] it will run refetchSimulation')
                refetchSimulation()
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [started])

    useEffect(() => {
        if (!simulationError) return
        const reason = getFailedReason(simulationError)
        setReason(reason)
    }, [simulationError])

    useEffect(() => {
        let timer = undefined
        if (isSuccess && started) {
            logger.info('[SimulateSwapStep] it will goNext in 1000 milliseconds')
            timer = setTimeout(() => {goNext()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])

    logger.debug('[SimulateSwapStep] ======= Latest state =======')
    logger.debug('[SimulateSwapStep] simulationError=', simulationError)
    logger.debug('[SimulateSwapStep] isPending =', isPending, '   isSuccess=', isSuccess)
    logger.debug('[SimulateSwapStep] isFetching =', isFetching)
    logger.debug('[SimulateSwapStep] started =', started, '   done=', done)
    logger.debug('[SimulateSwapStep] simulation =', simulation)
    
    return (
        <div className="flex justify-between items-center">
                <div className="flex items-center relative">
                    <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending && started ? '' : 'hidden'}`}/>
                    <SVGSign className="text-white size-4 ml-[4px]"/>
                    <div className={`text-xs pl-4 ${isSuccess 
                                                        ?  'text-zinc-400' 
                                                        : simulationError
                                                            ? 'text-red-600'
                                                            : 'text-pink-600'}`}>{isSuccess
                                                                                        ? 'Simulation passed'
                                                                                        : simulationError
                                                                                            ? 'Simulation failed'
                                                                                            : 'Simulate the swap'
                                                                                                }</div>
                </div>
                <div>
                    {
                        done 
                        ? isSuccess
                            ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                            : simulationError
                                ? <ToolTipHelper content={<div className="w-80">{reason}</div>}>
                                    <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                                  </ToolTipHelper>
                                : <></>
                        : <></> 
                    }  
                </div>
        </div>
    )
}

export default memo(SimulateSwapStep)