import SVGCheck from "@/lib/svgs/svg_check"
import SVGSign from "@/lib/svgs/svg_sign"
import { useEffect, useState } from "react"
import ToolTipHelper from "../common/ToolTipHelper"
import SVGXCircle from "@/lib/svgs/svg_x_circle"

type SimulateSwapStepProps = {
    started: boolean;
    goNext: () => void
}
const SimulateSwapStep:React.FC<SimulateSwapStepProps> = ({started, goNext}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSucess] = useState(false)

    useEffect(() => {
        let interval = null
        if (started) {
            setIsLoading(true)
            interval = setInterval(() => {
                setIsLoading(false)
                setSucess(true)
                goNext()
            }, 3000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [started])

    return (
        <div className="flex justify-between items-center">
                <div className="flex items-center relative">
                    <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isLoading ? '' : 'hidden'}`}/>
                    <SVGSign className="text-white size-4 ml-[4px]"/>
                    <div className={`text-xs pl-4 ${started 
                                                            ? isLoading 
                                                                ? 'text-pink-600' 
                                                                : success
                                                                    ? 'text-zinc-400'
                                                                    : 'text-red-600'
                                                            : 'text-zinc-400'}`}>{started
                                                                                        ? isLoading
                                                                                            ? 'Simulating the swap'
                                                                                            : success
                                                                                                ? 'Simulation passed'
                                                                                                : 'Simulation failed' 
                                                                                        : 'Simulate the swap'
                                                                                                }</div>
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

export default SimulateSwapStep