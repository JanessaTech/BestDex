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
import TokenSelect from "../token/TokenSelect"
import type { TokenType } from "@/lib/types"

type TokenProps = {
    token?: TokenType,
    handleTokenChange: () => void
}

const TokenSelection: React.FC<TokenProps> = ({token, handleTokenChange}) => {
    return (
        <Dialog>
            <DialogTrigger>
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
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-black">Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <VisuallyHidden.Root>
                    <DialogTitle/>
                    <DialogDescription/>
                </VisuallyHidden.Root>
                <TokenSelect />
            </DialogContent>
        </Dialog>
    )
}

export default TokenSelection