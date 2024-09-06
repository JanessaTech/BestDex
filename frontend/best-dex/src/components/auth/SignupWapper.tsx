"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { SignupState, signupState } from "@/lib/atoms"
import { useRecoilState } from "recoil"
import logger from "@/lib/logger"

type SignupWapperProps = {}

const SignupWapper: React.FC<SignupWapperProps> = () => {
    const [state, setState] = useRecoilState<SignupState>(signupState)

    const onOpenChange = (open: boolean) => {
        logger.debug('[Signup] onOpenChange. open =', open)
        setState({open: open})
    }

    return (
        <Dialog open={state.open} onOpenChange={onOpenChange}>
                <DialogTrigger></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-black">Create an account for your wallet</DialogTitle>
                        <DialogDescription>
                        Provide your personal information
                        </DialogDescription>
                    </DialogHeader>
                    <div className="text-zinc-600">
                        dd
                    </div>
                </DialogContent>
        </Dialog>
    )
}

export default SignupWapper