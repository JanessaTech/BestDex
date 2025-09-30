import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants";
import SVGCheck from "@/lib/svgs/svg_check";
import { IncreasePositionParamsType } from "@/lib/types";
import { memo, useEffect } from "react";
import {useSimulateContract} from 'wagmi'
import ToolTipHelper from "../common/ToolTipHelper";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import SVGSign from "@/lib/svgs/svg_sign";

type SimulateIncreaseLiquidityStepProps = {
    started: boolean;
    done: boolean;
    skip: boolean; // for test
    parsedCalldata: IncreasePositionParamsType,
    goNext: () => void
}
const SimulateIncreaseLiquidityStep:React.FC<SimulateIncreaseLiquidityStepProps> = ({started, done, skip, parsedCalldata, goNext}) => {
    const { data: simulation, error: simulationError, isPending, isFetching, isSuccess, refetch:refetchSimulation} = useSimulateContract({
        address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        abi: UNISWAP_V3_POSITION_MANAGER_ABI,
        functionName: 'increaseLiquidity',
        args: [parsedCalldata],
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
                console.log('[SimulateIncreaseLiquidityStep] skip SimulateIncreaseLiquidityStep')
                goNext()
                return
            }
            timer = setTimeout(() => {
                console.log('[SimulateIncreaseLiquidityStep] It will run refetchSimulation()...')
                refetchSimulation()
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [started])

    useEffect(() => {
        let timer = undefined
        if (isSuccess) {
            console.log('[SimulateIncreaseLiquidityStep] it will goNext in 1000 milliseconds')
            timer = setTimeout(() => {goNext()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])

    console.log('[SimulateIncreaseLiquidityStep] ====== Latest state ========')
    console.log('[SimulateIncreaseLiquidityStep] isSuccess=', isSuccess, ' isPending=', isPending, ' isFetching=', isFetching)
    console.log('[SimulateIncreaseLiquidityStep] simulationError=', simulationError)
    console.log('[SimulateIncreaseLiquidityStep] simulation=', simulation)
    
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending  && started ? '' : 'hidden'}`}/>
                <SVGSign className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${isSuccess
                                                ? 'text-zinc-400'  
                                                : simulationError
                                                    ? 'text-red-600'
                                                    : 'text-pink-600'}`}>{isSuccess
                                                                                ? `Simulation passed` 
                                                                                :   simulationError
                                                                                    ? `Failed to simulate adding a postion`
                                                                                    : `Simulate adding a postion ${skip ? '(skipped)' : ''}`                                                   
                                                                                    }</div>
            </div>
            {
                done
                ? isSuccess
                    ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                    : simulationError
                        ? <ToolTipHelper content={<div className="w-80">{simulationError?.message}</div>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                        : <></>
                : <></> 
                
            }  
        </div>
    )
}

export default memo(SimulateIncreaseLiquidityStep)