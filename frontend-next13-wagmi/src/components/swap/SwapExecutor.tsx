import { memo, useCallback, useState} from "react";
import SwapStep from "./SwapStep";
import SimulateSwapStep from "./SimulateSwapStep";
import SwapApproveStep from "./SwapApproveStep";
import { TokenType, LocalChainIds } from "@/common/types";
import {ChainId} from '@uniswap/sdk-core';

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}

type SwapeExecutorProps = {
    chainId: (ChainId | LocalChainIds),
    tokenFrom: TokenType;
    tokenTo: TokenType;
    approveAmount: string;
    calldata: `0x${string}`;
    handleSwapSuccess: (swapOut: string) => void
}
const SwapeExecutor: React.FC<SwapeExecutorProps> = ({chainId, tokenFrom, tokenTo, approveAmount, calldata, handleSwapSuccess}) => {
    const [step, setStep] = useState(1)

    const goNext = useCallback(() => {
        setStep((prev) => prev + 1)
    }, [])

    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <SwapApproveStep chainId={chainId} tokenFrom={tokenFrom} approveAmount={approveAmount} goNext={goNext}/>
            <Seperator/>
            <SimulateSwapStep chainId={chainId} started={step === 2} skip={false} done={step >= 2} calldata={calldata} goNext={goNext}/>
            <Seperator/>
            <SwapStep 
                chainId={chainId}
                started={step === 3} 
                tokenFrom={tokenFrom} tokenTo={tokenTo} 
                calldata={calldata} handleSwapSuccess={handleSwapSuccess}/> 
        </div>
    )
}

export default memo(SwapeExecutor)