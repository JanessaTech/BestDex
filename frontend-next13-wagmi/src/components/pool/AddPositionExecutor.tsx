import { memo, useCallback, useState } from "react"
import AddPositionApproveStep from "./AddPositionApproveStep"
import AddPositionStep from "./AddPositionStep"
import SimulateAddPositionStep from "./SimulateAddPositionStep"
import { MintPositionParamsType } from "@/lib/types"

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}

type AddPositionExecutorProps = {
    data: {calldata: string, parsedCalldata: MintPositionParamsType},
    handleAddSuccess: () => void;
}
const AddPositionExecutor:React.FC<AddPositionExecutorProps> = ({data, handleAddSuccess}) => {
    const [step, setStep] = useState(1)

    const goNext = useCallback(() => {
        setStep((prev) => prev + 1)
    }, [])
    
    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <SimulateAddPositionStep parsedCalldata={data.parsedCalldata} goNext={goNext}/>
            <Seperator/>
            <AddPositionApproveStep started={step === 2} done={step >=2} skip={false} goNext={goNext}/>
            {/* <Seperator/>
            <AddPositionApproveStep started={step === 3} done={step >=3} skip={false} goNext={goNext}/> */}
            <Seperator/>
            <AddPositionStep started={step === 3} handleAddSuccess={handleAddSuccess}/>
        </div>
    )
}

export default memo(AddPositionExecutor)