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
    setShowSwapSuccess: Dispatch<SetStateAction<boolean>>
}
const SwapeExecutor: React.FC<SwapeExecutorProps> = ({tokenFrom, approveAmount, setShowSwapSuccess}) => {
    const [step, setStep] = useState(1)

    const goNext = () => {
        setStep((prev) => prev + 1)
    }

    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <ApproveStep tokenFrom={tokenFrom} approveAmount={approveAmount} goNext={goNext}/>
            {/* <Seperator/>
            <SignStep/> */}
            <Seperator/>
            <ConfirmStep started={step === 2} setShowSwapSuccess={setShowSwapSuccess}/> 
        </div>
    )
}

export default SwapeExecutor