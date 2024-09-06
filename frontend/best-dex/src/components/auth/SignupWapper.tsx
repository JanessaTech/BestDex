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
import Signup from "./Signup"

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
                <DialogContent className="w-4/5 md:w-2/3 min-w-[300px] max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-black">Create a new account</DialogTitle>
                        <DialogDescription className="text-xs">
                            Provide your personal information
                        </DialogDescription>
                    </DialogHeader>
                    <Signup/>
                </DialogContent>
        </Dialog>
    )
}

export default SignupWapper