import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Arrow from "@/lib/svgs/Arrow"
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import TokenSelect from "./TokenSelect"
import type { TokenType } from "@/lib/types"

type TokenProps = {
    isSwap: boolean
    open: boolean,
    token?: TokenType,
    onOpenChange: (open: boolean) => void
    handleTokenChange: (newToken: TokenType) => void
}

const TokenSelection: React.FC<TokenProps> = ({isSwap, open, token, onOpenChange, handleTokenChange}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger>
                <div className={`group h-[60px] border-2 border-zinc-500 
                                flex items-center justify-between cursor-pointer px-2
                                ${isSwap ? 'w-[120px] border-e-0 rounded-s-lg': 'rounded-lg'} hover:border-sky-500
                                ${token ? 'bg-white': 'buttonEffect'}`}>
                    {
                        token ? <div className="flex items-center">
                                    <img src={`/imgs/tokens/${token.name}.png`} width={25} height={25} alt={token.name}/>
                                    <span className="text-zinc-600 font-semibold ml-2">{token.symbol}</span>
                                </div>
                            : <span className="font-semibold">Select token</span>
                    }
                    <Arrow className={`h-[15px] w-[15px]
                                    ${token ? 'text-black group-hover:text-sky-500' : 'text-white'}`}/>
                </div> 
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-black">Select a token</DialogTitle>
                </DialogHeader>
                <VisuallyHidden.Root>
                    <DialogDescription/>
                </VisuallyHidden.Root>
                <TokenSelect handleTokenChange={handleTokenChange}/>
            </DialogContent>
        </Dialog>
    )
}

export default TokenSelection