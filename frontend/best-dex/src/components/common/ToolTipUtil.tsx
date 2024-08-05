import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ToolTipSimpleToolProps = {
    children: React.ReactNode,
    content: string

}

const ToolTipUtil: React.FC<ToolTipSimpleToolProps> = ({children, content}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent align="end">
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider> 
    )
    
}

export default ToolTipUtil