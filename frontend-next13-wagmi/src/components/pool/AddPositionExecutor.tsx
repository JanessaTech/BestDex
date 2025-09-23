import { memo, useCallback, useState } from "react"
import AddPositionApproveStep from "./AddPositionApproveStep"
import AddPositionStep from "./AddPositionStep"
import SimulateAddPositionStep from "./SimulateAddPositionStep"
import { MintPositionParamsType, TokenType } from "@/lib/types"

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}


type AddPositionExecutorProps = {
    data: {calldata: string, parsedCalldata: MintPositionParamsType},
    token0: TokenType;
    token1: TokenType;
    token0Input:string;
    token1Input:string;
    handleAddSuccess: () => void;
}
const AddPositionExecutor:React.FC<AddPositionExecutorProps> = ({data, token0, token1, token0Input, token1Input,
                                                                    handleAddSuccess}) => {
    const [step, setStep] = useState(1)

    const goNext = useCallback(() => {
        setStep((prev) => prev + 1)
    }, [])
    
    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            
            <AddPositionApproveStep 
                token={token0} 
                tokenInput={token0Input}
                started={step === 1} done={step >= 1} 
                skip={false} 
                goNext={goNext}/>
            <Seperator/>
            <AddPositionApproveStep 
                token={token1} 
                tokenInput={token1Input}
                started={step === 2} done={step >= 2} 
                skip={false} 
                goNext={goNext}/>
            <Seperator/>
            <SimulateAddPositionStep 
                started={step === 3} done={step >= 3} 
                parsedCalldata={data.parsedCalldata} goNext={goNext}/>
            <Seperator/>
            <AddPositionStep started={step === 4} handleAddSuccess={handleAddSuccess}/>
        </div>
    )
}

export default memo(AddPositionExecutor)