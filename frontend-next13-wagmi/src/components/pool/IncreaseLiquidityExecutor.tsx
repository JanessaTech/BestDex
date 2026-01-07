import { useCallback, useState } from "react"
import AddPositionApproveStep from "./AddPositionApproveStep";
import SimulateIncreaseLiquidityStep from "./SimulateIncreaseLiquidityStep";
import IncreaseLiquidityStep from "./IncreaseLiquidityStep";
import { IncreasePositionParamsType, LocalChainIds, TokenType } from "@/common/types";
import {ChainId} from '@uniswap/sdk-core';

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}
type IncreaseLiquidityExecutorProps = {
    chainId: (ChainId | LocalChainIds)
    data: {calldata: string, parsedCalldata: IncreasePositionParamsType},
    token0: TokenType;
    token1: TokenType;
    token0Input:string;
    token1Input:string;
    handleIncreaseLiquiditySuccess:(token0Deposited: string, token1Deposited: string, liquidity: string) => void
}
const IncreaseLiquidityExecutor: React.FC<IncreaseLiquidityExecutorProps> = ({chainId, data, token0, token1, token0Input, token1Input,
                                                                handleIncreaseLiquiditySuccess
}) => {
    const [step, setStep] = useState(1)

    const goNext = useCallback(() => {
        setStep((prev) => prev + 1)
    }, [])

    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <AddPositionApproveStep 
                chainId={chainId}
                token={token0} tokenInput={token0Input}
                started={step === 1} done={step >= 1} skip={false} 
                goNext={goNext}/>
            <Seperator/>
            <AddPositionApproveStep 
                chainId={chainId}
                token={token1} tokenInput={token1Input}
                started={step === 2} done={step >= 2} skip={false} 
                goNext={goNext}/>
            <Seperator/>
            <SimulateIncreaseLiquidityStep 
                chainId={chainId}
                started={step === 3} done={step >= 3} skip={false} 
                parsedCalldata={data.parsedCalldata} goNext={goNext}/>
            <Seperator/>
            <IncreaseLiquidityStep 
                chainId={chainId}
                token0={token0} token1={token1}
                started={step === 4} parsedCalldata={data.parsedCalldata} 
                handleIncreaseLiquiditySuccess={handleIncreaseLiquiditySuccess}
                />
        </div>
    )
}

export default IncreaseLiquidityExecutor