import SVGSign from "@/lib/svgs/svg_sign"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"
import { memo, useEffect, useState } from "react"
import SVGCheck from "@/lib/svgs/svg_check"

type SimulateAddPositionStepProps = {
    goNext: () => void
}

const SimulateAddPositionStep:React.FC<SimulateAddPositionStepProps> = ({goNext}) => {
    const [isSuccess, setIsSuccess] = useState(false)
    const [isPending, setIsPending] = useState(true)

    const handleSimulate = () => {
        console.log('handleSimulate() ....')
    }

    useEffect(() => {
        handleSimulate()
        setTimeout(() => {
            setIsPending(false)
            setIsSuccess(true)
        }, 2000);
    }, [])

    useEffect(() => {
        let timer = undefined
        if (isSuccess) {
            console.log('it will goNext in 1000 milliseconds')
            timer = setTimeout(() => {goNext()}, 1000)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isSuccess])

    console.log('[SimulateAddPositionStep] isSuccess=', isSuccess, ' isPending=', isPending)
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isPending ? '' : 'hidden'}`}/>
                <SVGSign className="text-white size-4 ml-[4px]"/>
                <div className="text-xs pl-4 text-pink-600">Simulate adding a position</div>
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

export default memo(SimulateAddPositionStep)