import { memo } from "react"
import AddPositionApproveStep from "./AddPositionApproveStep"
import AddPositionStep from "./AddPositionStep"
import SimulateAddPositionStep from "./SimulateAddPositionStep"

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}

type AddPositionExecutorProps = {}
const AddPositionExecutor:React.FC<AddPositionExecutorProps> = ({}) => {
    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <SimulateAddPositionStep/>
            <Seperator/>
            <AddPositionApproveStep/>
            <Seperator/>
            <AddPositionApproveStep/>
            <Seperator/>
            <AddPositionStep/>
        </div>
    )
}

export default memo(AddPositionExecutor)