import SVGCheck from "@/lib/svgs/svg_check"
import SVGSign from "@/lib/svgs/svg_sign"
import { memo, useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useSimulateContract } from "wagmi"
import { decodeFunctionData, parseAbi } from 'viem'


const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
const SwapRouter02ABI = parseAbi(['function multicall(uint256,bytes[]) payable returns (bytes[])'])
const parseCalldata = (calldata: `0x${string}`) => {
    try {
        //console.log('calldata=', calldata)
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
        //console.log('deadline=', deadline)
        //console.log('innerCalls=', innerCalls)
        return {deadline, innerCalls}
    } catch(err) {
        console.log('failed to parse calldata due to:', err)
    }
    return {deadline: undefined, innerCalls: undefined}
}

type SimulateSwapStepProps = {
    started: boolean;
    calldata: `0x${string}`;
    goNext: () => void
}
const SimulateSwapStep:React.FC<SimulateSwapStepProps> = ({started, calldata, goNext}) => {
    const {deadline, innerCalls} = parseCalldata(calldata)
    if (!deadline || !innerCalls) return <div>Failed to parse calldata</div>
    const [reason, setReason] = useState('')

    const { data: simulation, error: simulationError, isPending, isSuccess, refetch:refetchSimulation} = useSimulateContract({
        address: V3_SWAP_ROUTER_ADDRESS,
        abi: SwapRouter02ABI,
        functionName: 'multicall',
        args: [deadline, innerCalls],
        query: {
            enabled: false
        }
    })

    useEffect(() => {
        let interval = undefined
        if (started && isPending) {
            console.log('it will run refetchSimulation in 200 millionseconds')
            interval = setInterval(() => {refetchSimulation()}, 200)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [started, isPending])

    useEffect(() => {
        if (!simulationError) return
        console.log('simulationError?.name:', simulationError?.name)
        console.log('simulationError?.message:', simulationError?.message)
        if (simulationError?.cause) {
            const reason = (simulationError?.cause as any)?.reason
            setReason(reason)
        }
        
    }, [simulationError])

    useEffect(() => {
        if (isSuccess) {
            goNext()
        }
    }, [isSuccess])

    console.log('simulationError=', simulationError)
    console.log('isPending =', isPending, '   isSuccess=', isSuccess)

    return (
        <div className="flex justify-between items-center">
                <div className="flex items-center relative">
                    <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending && started ? '' : 'hidden'}`}/>
                    <SVGSign className="text-white size-4 ml-[4px]"/>
                    <div className={`text-xs pl-4 ${started 
                                                            ? isPending 
                                                                ? 'text-pink-600' 
                                                                : isSuccess
                                                                    ? 'text-zinc-400'
                                                                    : 'text-red-600'
                                                            : 'text-zinc-400'}`}>{started
                                                                                        ? isPending
                                                                                            ? 'Simulating the swap'
                                                                                            : isSuccess
                                                                                                ? 'Simulation passed'
                                                                                                : 'Simulation failed' 
                                                                                        : 'Simulate the swap'
                                                                                                }</div>
                </div>
                <div>
                    {
                        started
                        ? isPending
                            ? <></>
                            : isSuccess
                                ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                                : <ToolTipHelper content={<div className="w-80">{reason}</div>}>
                                    <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                                </ToolTipHelper>
                        : <></>
                    }  
                </div>
        </div>
    )
}

export default memo(SimulateSwapStep)