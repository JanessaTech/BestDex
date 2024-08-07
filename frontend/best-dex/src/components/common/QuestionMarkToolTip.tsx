
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import QuestionMark from "@/lib/svgs/QuestionMark"
import { useState } from "react"

type QuestionMarkToolTipProps = {
    children: React.ReactNode
}

const QuestionMarkToolTip: React.FC<QuestionMarkToolTipProps> = ({children}) => {
    const [open, setOpen] = useState<boolean>(false)
    const onMouseEnter = () => {
        setOpen(true)
    }
    const onMouseLeave = () => {
        setOpen(false)
    }

    return (
        <TooltipProvider>
            <Tooltip open={open}>
                <TooltipTrigger>
                    <QuestionMark 
                        className="w-[15px] h-[15px] text-zinc-400"
                        onMouseEnter={onMouseEnter} 
                        onMouseLeave={onMouseLeave}/>
                </TooltipTrigger>
                <TooltipContent>
                    {children}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default QuestionMarkToolTip