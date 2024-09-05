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

type SignupProps = {}

const Signup: React.FC<SignupProps> = () => {
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
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                    </DialogHeader>
                </DialogContent>
        </Dialog>
    )
}

export default Signup