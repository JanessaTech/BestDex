import SVGCheck from "@/lib/svgs/svg_check"
import SVGCheckCircle from "@/lib/svgs/svg_check_circle"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"

type ConfirmStepProps = {
    setShowSwapSuccess: Dispatch<SetStateAction<boolean>>
}
const ConfirmStep:React.FC<ConfirmStepProps> = ({setShowSwapSuccess}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSucess] = useState(true)

    useEffect(() => {
        setInterval(() => {
            //setSucess(true)
            //setShowSwapSuccess(true)
        }, 10000)
    }, [])

    return (
        <div className="flex justify-between items-center">
                <div className="flex items-center relative">
                    <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isLoading ? '' : 'hidden'}`}/>
                    <SVGCheckCircle className="text-white size-5 ml-[2px]"/>
                    <div className={`text-xs pl-3 ${isLoading ? 'text-pink-600' : 'text-zinc-400'}`}>{isLoading 
                                                                                                            ? 'Confirm swap in wallet' 
                                                                                                            : success
                                                                                                                ? 'Confirmed'
                                                                                                                : 'Failed'}</div>
                </div>
                <div>
                    {
                        isLoading
                        ? <></>
                        : success
                            ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                            : <ToolTipHelper content={<p>The reason why it failed</p>}>
                                <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                            </ToolTipHelper>
                    }  
                </div>
        </div>  
    )
}

export default ConfirmStep