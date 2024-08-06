import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ToolTipSimpleToolProps = {
    children: React.ReactNode,
    align?: undefined | 'start' | 'center' | 'end',
    content: string

}

const ToolTipUtil: React.FC<ToolTipSimpleToolProps> = ({children, align, content}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent align={align ? align : "end"}>
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider> 
    )
    
}

export default ToolTipUtil