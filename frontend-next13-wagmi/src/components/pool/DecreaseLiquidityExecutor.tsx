import { useCallback, useState } from "react"
import SimulateDecreaseLiquidityStep from "./SimulateDecreaseLiquidityStep"
import DecreaseLiquidityStep from "./DecreaseLiquidityStep"
import { LocalChainIds, TokenType } from "@/common/types"
import {ChainId} from '@uniswap/sdk-core'

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}

type DecreaseLiquidityExecutorType = {
    chainId: (ChainId | LocalChainIds)
    data: {calldata: `0x${string}`, parsedCalldata: readonly `0x${string}`[]};
    token0: TokenType;
    token1: TokenType;
    handleDecreaseLiquiditySuccess:(token0Deposited: string, token1Deposited: string) => void
}
const DecreaseLiquidityExecutor: React.FC<DecreaseLiquidityExecutorType> = ({chainId, data, token0, token1, handleDecreaseLiquiditySuccess}) => {
    const [step, setStep] = useState(1)

    const goNext = useCallback(() => {
        setStep((prev) => prev + 1)
    }, [])

    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <SimulateDecreaseLiquidityStep chainId={chainId} started={step === 1} done={step >= 1} skip={false} 
                parsedCalldata={data.parsedCalldata}
                goNext={goNext}/>
            <Seperator/>
            <DecreaseLiquidityStep chainId={chainId} token0={token0} token1={token1}
                started={step === 2}
                calldata={data.calldata}
                handleDecreaseLiquiditySuccess={handleDecreaseLiquiditySuccess}/>
        </div>
    )
}

export default DecreaseLiquidityExecutor