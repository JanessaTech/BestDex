import SVGSign from "@/lib/svgs/svg_sign"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { memo, useEffect } from "react"
import SVGCheck from "@/lib/svgs/svg_check"
import { MintPositionParamsType } from "@/lib/types"
import {useSimulateContract} from 'wagmi'
import { NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS, UNISWAP_V3_POSITION_MANAGER_ABI } from "@/config/constants"

type SimulateAddPositionStepProps = {
    started: boolean;
    done: boolean;
    parsedCalldata: MintPositionParamsType,
    goNext: () => void
}

const SimulateAddPositionStep:React.FC<SimulateAddPositionStepProps> = ({started, done, parsedCalldata, goNext}) => {
    const { data: simulation, error: simulationError, isPending, isFetching, isSuccess, refetch:refetchSimulation} = useSimulateContract({
        address: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
        abi: UNISWAP_V3_POSITION_MANAGER_ABI,
        functionName: 'mint',
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
            timer = setTimeout(() => {
                console.log('It will run refetchSimulation()...')
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
            console.log('it will goNext in 1000 milliseconds')
            timer = setTimeout(() => {goNext()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])

    console.log('[SimulateAddPositionStep] isSuccess=', isSuccess, ' isPending=', isPending, ' isFetching=', isFetching)
    console.log('[SimulateAddPositionStep] simulationError=', simulationError)
    if (simulation) {
        console.log('simulation=', simulation)
    }

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
                                                                                    : `Simulate adding a postion`                                                   
                                                                                    }</div>
            </div>
            {
                done
                ? isSuccess
                    ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                    : simulationError
                        ? <ToolTipHelper content={<div className="w-80">error?.message</div>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                        : <></>
                : <></> 
                
            }  
        </div>
    )
}

export default memo(SimulateAddPositionStep)