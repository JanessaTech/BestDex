"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { AuthState, WalletAddressChangeState, authState, walletAddressChangeState } from "@/lib/atoms"
import { useRecoilState } from "recoil"
import logger from "@/lib/logger"

type WalletAddressChangeProps = {}

const WalletAddressChange: React.FC<WalletAddressChangeProps> = () => {
    const [walletState, setWalletState] = useRecoilState<WalletAddressChangeState>(walletAddressChangeState)
    const [auth, setAuth] = useRecoilState<AuthState>(authState)

    const onOpenChange = (open: boolean) => {
        logger.debug('[WalletAddressChange] onOpenChange. open =', open)
        setWalletState({changed: open})
    }

    const handleClick = () => {
        if (auth.loginedUser) {
            setAuth({walletType: undefined, loginedUser: undefined})
        }
        setWalletState({changed: false})
    }

    return (
        <Dialog open={walletState.changed} onOpenChange={onOpenChange}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className="w-4/5 md:w-2/3 min-w-[300px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-black">Disconnect Wallet</DialogTitle>
                        <DialogDescription className="text-xs">
                            You are about to disconnect wallet once you changed the wallet address
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center">
                        <button className="rounded-full px-5 py-[2px] buttonEffect" onClick={handleClick}>OK</button>
                    </div>
                </DialogContent>
        </Dialog>
    )
}

export default WalletAddressChange