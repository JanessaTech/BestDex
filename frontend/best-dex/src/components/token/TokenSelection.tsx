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
    open: boolean,
    token?: TokenType,
    onOpenChange: (open: boolean) => void
    handleTokenChange: (newToken: TokenType) => void
}

const TokenSelection: React.FC<TokenProps> = ({open, token, onOpenChange, handleTokenChange}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger>
                <div className={`group h-[60px] w-[150px] rounded-s-lg border-2 border-zinc-500 
                                flex items-center justify-between cursor-pointer px-2
                                border-e-0 hover:border-sky-700
                                ${token ? 'bg-white': 'bg-sky-700 hover:bg-sky-600 active:bg-sky-500'}`}>
                    {
                        token ? <div className="flex items-center">
                                    <img src={`/imgs/tokens/${token.name}.png`} width={25} height={25} alt={token.name}/>
                                    <span className="text-zinc-600 font-semibold ml-2">{token.symbol}</span>
                                </div>
                            : <span className="font-semibold">Select token</span>
                    }
                    <Arrow className={`h-[15px] w-[15px]
                                    ${token ? 'text-black group-hover:text-sky-700' : 'text-white'}`}/>
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