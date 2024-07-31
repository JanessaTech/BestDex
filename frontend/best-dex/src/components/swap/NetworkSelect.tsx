import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import NetworkConnect from "../network/NetworkConnect"
import type { NetworkType } from "@/lib/types"

type NetworkSelectProps = {
    open: boolean,
    network: NetworkType,
    handleNetworkOpen: (open: boolean) => void,
    handleNetworkChange: (network: NetworkType) => void
}

const NetworkSelect: React.FC<NetworkSelectProps> = ({open, network, handleNetworkOpen, handleNetworkChange}) => {
    const onOpenChange = (open: boolean) => {
        handleNetworkOpen(open)
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger className="w-full">
                <div className="border border-white h-[60px] rounded-full px-5 flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <img src={`/imgs/networks/${network.name}.png`} alt={network.name} className="mr-4"/>
                        <span className="text-xl">{network.label}</span>
                    </div>
                    <img src="/imgs/down_arrow.svg" alt="select network" className="mr-3 cursor-pointer"/>
                </div>
            </PopoverTrigger>     
            <PopoverContent align='end' sideOffset={-30}>
                <NetworkConnect network={network} handleNetworkChange={handleNetworkChange}/>
            </PopoverContent>
        </Popover>
    )
}

export default NetworkSelect