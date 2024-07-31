import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import Arrow from "@/lib/svgs/Arrow"
import TokenSelect from "../token/TokenSelect"
import type { TokenType } from "@/lib/types"

type FromTokenProps = {
    token?: TokenType,
    handleTokenChange: () => void
}

const TokenSelection: React.FC<FromTokenProps> = ({token, handleTokenChange}) => {
    return (
        <Popover>
            <PopoverTrigger>
                <div className={`h-[60px] w-[150px] rounded-s-lg border-2 border-zinc-500 
                                flex items-center justify-between cursor-pointer px-2
                                border-e-0
                                ${token ? 'bg-white': 'bg-sky-700 hover:bg-sky-600 active:bg-sky-500'}`} onClick={handleTokenChange}>
                    {
                        token ? <div className="flex items-center">
                                    <img src="/imgs/tokens/eth.png" width={25} height={25} alt="eth"/>
                                    <span className="text-zinc-600 font-semibold ml-2">ETH</span>
                                </div>
                            : <span className="font-semibold">Select token</span>
                    }
                    <Arrow className={`h-[15px] w-[15px]
                                    ${token ? 'text-black hover:text-sky-700' : 'text-white'}`}/>
                </div>
            </PopoverTrigger>
            <PopoverContent align="end">
                <TokenSelect />
            </PopoverContent>
        </Popover>
    )
}

export default TokenSelection