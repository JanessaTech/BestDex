import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import SVGArrowDown from "@/lib/svgs/svg_arrow_down";
import SVGCheck from "@/lib/svgs/svg_check";
import { Chain } from "@rainbow-me/rainbowkit";
import Image from "next/image";

type NetworkOptionProps = {
    networkOpen: boolean;
    curChain: Chain;
    chains: readonly Chain[];
    onOpenChange: (open: boolean) => void;
    handleSwitchNetwork: (id: number) => void
}

const NetworkOption:React.FC<NetworkOptionProps> = ({networkOpen, curChain, chains, onOpenChange, handleSwitchNetwork}) => {

    return (
        <Popover open={networkOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger className='w-full' asChild>
                <div className='h-12 w-full border-zinc-400 rounded-full border-[0.5px] cursor-pointer relative'>
                    <div className='w-full h-full hover:bg-pink-500/10 rounded-full'></div>
                    <SVGArrowDown className='w-4 h-4 text-white absolute right-4 top-4'/>
                    <div className='flex items-center absolute top-2 left-2'>
                        <div className='rounded-full w-fit h-fit overflow-hidden'>
                            <Image src={`/imgs/networks/${curChain.name.replace(/\s+/g, '').toLowerCase()}.png`} alt={curChain.name} width={32} height={32}/>
                        </div>
                        <span className='text-sm px-2'>{curChain.name}</span>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent align='start' className='bg-zinc-900 border-zinc-600 border-[1px] PopoverContent text-white'>
                <ul>
                    {
                        chains.map((chain) => (
                            <li key={chain.id} className='hover:bg-zinc-700/50 cursor-pointer rounded-md' onClick={() => handleSwitchNetwork(chain.id)}>
                                <div className='flex items-center py-2'>
                                    <SVGCheck className={`w-4 h-4 ml-3 ${curChain.id === chain.id ? '' : 'invisible'}`}/>
                                    <div className='rounded-full w-fit h-fit overflow-hidden mx-2'>
                                        <Image src={`/imgs/networks/${chain.name.replace(/\s+/g, '').toLowerCase()}.png`} alt={chain.name} width={28} height={28}/>
                                    </div>
                                    <span className='text-sm'>{chain.name}</span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </PopoverContent>                 
        </Popover>   
    )
}

export default NetworkOption