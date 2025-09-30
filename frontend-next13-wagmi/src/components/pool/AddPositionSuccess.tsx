import SVGCheck from "@/lib/svgs/svg_check";
import { TokenType } from "@/lib/types";
import QuestionMarkToolTip from "../common/QuestionMarkToolTip";
import { default as DexToken } from "../common/Token";
import Link from "next/link";


type AddPositionSuccessProps = {
    token0: TokenType;
    token1: TokenType;
    depositedToken0: string;
    depositedToken1: string;
}
const AddPositionSuccess:React.FC<AddPositionSuccessProps> = ({token0, token1, depositedToken0, depositedToken1}) => {
    return (
        <div className="flex flex-col gap-y-4 items-center">
            <div className="flex flex-col gap-y-4 items-center">
                <div className="py-3">
                    <SVGCheck className="text-white bg-green-600 size-14 p-2 rounded-full"/>
                </div>
                <div className="font-semibold">A new position was added!</div>
            </div>
            <div className="border-t-[1px] border-zinc-600 my-4 text-sm">
                <div className="py-2 flex items-center">
                    <span>You deposited:</span>
                    <QuestionMarkToolTip>
                        <div className="w-48">The actual amounts are determined by the live data in the UniswapV3Pool</div>
                    </QuestionMarkToolTip>
                </div>
                <div className="flex py-2">
                    <span className="text-pink-600 pr-2">{depositedToken0}</span>
                    <DexToken token={token0} imageSize={20}/>
                </div>
                <div className="flex">
                    <span className="text-pink-600 pr-2">{depositedToken1}</span>
                    <DexToken token={token1} imageSize={20}/>
                </div>
            </div>
            <div><Link href="www.baidu.com" className="text-xs text-pink-600">View details</Link></div>
        </div>
        
    )
}

export default AddPositionSuccess