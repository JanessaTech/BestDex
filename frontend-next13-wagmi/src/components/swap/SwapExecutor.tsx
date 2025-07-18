import type { TokenType } from "@/lib/types";
import Token from "../common/Token";
import SVGCheck from "@/lib/svgs/svg_check";
import SVGXCircle from "@/lib/svgs/svg_x_circle";
import { useState } from "react";
import SVGLockOpen from "@/lib/svgs/svg_lock_open";
import ToolTipHelper from "../common/ToolTipHelper";
import SVGSign from "@/lib/svgs/svg_sign";
import SVGCheckCircle from "@/lib/svgs/svg_check_circle";

const Seperator = () => {
    return (
        <div className="border-x-[1px] border-zinc-400 h-3 w-0 ml-[10px]"></div>
    )
}

type ApproveStepProps = {
    tokenFrom: TokenType;
}
const ApproveStep: React.FC<ApproveStepProps> = ({tokenFrom}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [success, isSucess] = useState(true)

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isLoading ? '' : 'hidden'}`}/>
                <SVGLockOpen className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${isLoading ? 'text-pink-600' : 'text-zinc-400'}`}>Approve in wallet</div>
            </div>
            <div>
                {
                    isLoading
                    ? <></>
                    : success
                        ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                        : <ToolTipHelper content={<p>The reason why it failed</p>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                }  
            </div>
        </div>
    )
}

type SignStepProps = {}
const SignStep:React.FC<SignStepProps> = ({}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [success, isSucess] = useState(true)

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isLoading ? '' : 'hidden'}`}/>
                <SVGSign className="text-white size-4 ml-[4px]"/>
                <div className={`text-xs pl-4 ${isLoading ? 'text-pink-600' : 'text-zinc-400'}`}>Sign message</div>
            </div>
            <div>
                {
                    isLoading
                    ? <></>
                    : success
                        ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                        : <ToolTipHelper content={<p>The reason why it failed</p>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                }  
            </div>
        </div>
    )
}
type ConfirmStepProps = {}
const ConfirmStep:React.FC<ConfirmStepProps> = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [success, isSucess] = useState(false)

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center relative">
                <div className={`size-6 border-[1px] rounded-full border-pink-600 border-t-transparent animate-spin absolute ${isLoading ? '' : 'hidden'}`}/>
                <SVGCheckCircle className="text-white size-5 ml-[2px]"/>
                <div className={`text-xs pl-3 ${isLoading ? 'text-pink-600' : 'text-zinc-400'}`}>Confirm swap in wallet</div>
            </div>
            <div>
                {
                    isLoading
                    ? <></>
                    : success
                        ? <SVGCheck className="size-4 text-green-600 mx-3"/>
                        : <ToolTipHelper content={<p>The reason why it failed</p>}>
                            <SVGXCircle className="size-5 text-red-600 bg-inherit rounded-full cursor-pointer mx-3"/>
                          </ToolTipHelper>
                }  
            </div>
        </div>
    )
}

type SwaperExecutorProps = {
    tokenFrom: TokenType;
}
const SwaperExecutor: React.FC<SwaperExecutorProps> = ({tokenFrom}) => {
    return (
        <div className="border-t-[1px] border-zinc-600 my-4 py-3 flex flex-col gap-y-1">
            <ApproveStep tokenFrom={tokenFrom}/>
            <Seperator/>
            <SignStep/>
            <Seperator/>
            <ConfirmStep/> 
        </div>
    )
}

export default SwaperExecutor