import { memo, useState } from "react";
import CollectFeeStep from "./CollectFeeStep";
import { CollectFeeParamsType, TokenType } from "@/common/types";

type CollectFeeExecutorProps = {
    data: {calldata: `0x${string}`, parsedCalldata: CollectFeeParamsType};
    token0: TokenType;
    token1: TokenType;
    handleCollectFeeSuccess: (token0Deposited: string, token1Deposited: string) => void
}

const CollectFeeExecutor:React.FC<CollectFeeExecutorProps> = ({data, token0, token1, handleCollectFeeSuccess}) => {
    const [step, setStep] = useState(1)

    // const goNext = useCallback(() => {
    //     setStep((prev) => prev + 1)
    // }, [])

    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
           <CollectFeeStep 
                token0={token0} token1={token1}
                started={step === 1} parsedCalldata={data.parsedCalldata} 
                handleCollectFeeSuccess={handleCollectFeeSuccess}/>
        </div>
    )
}

export default memo(CollectFeeExecutor)