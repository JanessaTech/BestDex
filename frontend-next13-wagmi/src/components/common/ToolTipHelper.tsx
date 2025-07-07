import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ToolTipSimpleToolProps = {
    children: React.ReactNode,
    align?: undefined | 'start' | 'center' | 'end',
    content: React.ReactNode

}

const ToolTipHelper: React.FC<ToolTipSimpleToolProps> = ({children, align, content}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent align={align ? align : "end"}>
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider> 
    )
    
}

export default ToolTipHelper