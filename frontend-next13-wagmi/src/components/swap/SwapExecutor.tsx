import type { TokenType } from "@/lib/types";
import { Dispatch, SetStateAction, useState} from "react";
import ApproveStep from "./ApproveStep";
import SignStep from "./SignStep";
import ConfirmStep from "./ConfirmStep";

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

    const goNext = () => {
        setStep((prev) => prev + 1)
    }

    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <ApproveStep tokenFrom={tokenFrom} approveAmount={approveAmount} goNext={goNext}/>
            <Seperator/>
            <ConfirmStep started={step === 2} calldata={calldata} setShowSwapSuccess={setShowSwapSuccess}/> 
        </div>
    )
}

export default SwapeExecutor