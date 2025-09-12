import SVGSign from "@/lib/svgs/svg_sign"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"

type AddPositionStepProps = {
    started: boolean;
    handleAddSuccess: () => void;
}

const AddPositionStep:React.FC<AddPositionStepProps> = ({started, handleAddSuccess}) => {
    const [isSuccess, setIsSuccess] = useState(false)
    const [isPending, setIsPending] = useState(true)
    const handleAddPosition = () => {
        console.log('handleAddPosition...')
    }
    useEffect(() => {
        let timer = undefined
        if (started) {
            timer = setTimeout(() => {
                console.log('[AddPositionStep] it will run handleAddPosition')
                handleAddPosition()
                setIsPending(false)
                setIsSuccess(true)
            }, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [started])

    useEffect(() => {
        let timer = undefined
        if (isSuccess) {
            console.log('it will handleAddSuccess in 1000 milliseconds')
            timer = setTimeout(() => {handleAddSuccess()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])
    console.log('[AddPositionStep] isSuccess=', isSuccess, ' isPending=', isPending)
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending && started? '' : 'hidden'}`}/>
                <SVGSign className="text-white size-4 ml-[4px]"/>
                <div className="text-xs pl-4 text-pink-600">Add a position</div>
            </div>
            {
                isPending
                ? <></>
                : isSuccess
                    ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                    : <ToolTipHelper content={<div className="w-80">error?.message</div>}>
                        <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                        </ToolTipHelper>
            }  
        </div>
    )
}

export default AddPositionStep