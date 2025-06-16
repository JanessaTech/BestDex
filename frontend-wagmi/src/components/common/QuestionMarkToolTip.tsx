import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import SVGQuestionMark from "@/lib/svgs/svg_question_mark"
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
                    <SVGQuestionMark 
                        className="mx-2 w-[15px] h-[15px] text-zinc-400"
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