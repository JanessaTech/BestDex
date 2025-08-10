import type { TokenType } from "@/lib/types";
import { Dispatch, SetStateAction, memo, useCallback, useState} from "react";
import ApproveStep from "./ApproveStep";
import SwapStep from "./SwapStep";
import SimulateSwapStep from "./SimulateSwapStep";

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}

type SwapeExecutorProps = {
    tokenFrom: TokenType;
    approveAmount: string;
    calldata: `0x${string}`;
    setShowSwapSuccess: Dispatch<SetStateAction<boolean>>
}
const SwapeExecutor: React.FC<SwapeExecutorProps> = ({tokenFrom, approveAmount, calldata, setShowSwapSuccess}) => {
    const [step, setStep] = useState(1)

    const goNext = useCallback(() => {
        setStep((prev) => prev + 1)
    }, [])
    console.log('[SwapeExecutor] step ===', step)
    //console.log('calldata=', calldata)

    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <ApproveStep tokenFrom={tokenFrom} approveAmount={approveAmount} goNext={goNext}/>
            <Seperator/>
            <SimulateSwapStep started={step === 2} skip={false} done={step >= 2} calldata={calldata} goNext={goNext}/>
            <Seperator/>
            <SwapStep started={step === 3} calldata={calldata} setShowSwapSuccess={setShowSwapSuccess}/> 
        </div>
    )
}

export default memo(SwapeExecutor)