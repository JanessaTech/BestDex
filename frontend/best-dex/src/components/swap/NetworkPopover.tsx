import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import type { NetworkType } from "@/lib/atoms" 
import NetworkConnect from "../network/NetworkConnect"
import Arrow from "@/lib/svgs/Arrow"

type NetworkSelectProps = {
    open: boolean,
    network: NetworkType,
    handleNetworkOpen: (open: boolean) => void,
    handleNetworkChange: (network: NetworkType) => void
}

const NetworkPopover: React.FC<NetworkSelectProps> = ({open, network, handleNetworkOpen, handleNetworkChange}) => {
    const onOpenChange = (open: boolean) => {
        handleNetworkOpen(open)
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger className="w-full">
                <div className=" group border border-white h-[60px] hover:border-sky-500
                rounded-full px-5 flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <img src={`/imgs/networks/${network.name}.png`} alt={network.name} className="mr-4"/>
                        <span className="text-xl">{network.label}</span>
                    </div>
                    <Arrow className="mr-3 cursor-pointer group-hover:text-sky-500"/>
                </div>
            </PopoverTrigger>     
            <PopoverContent align='end' sideOffset={-30}>
                <NetworkConnect network={network} handleNetworkChange={handleNetworkChange}/>
            </PopoverContent>
        </Popover>
    )
}

export default NetworkPopover