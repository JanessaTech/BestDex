import SVGClose from "@/lib/svgs/svg_close"
import { TokenType } from "@/lib/types";
import Token from "../common/Token";
import AddPositionExecutor from "./AddPositionExecutor";

type ReviewAddPositionProps = {
    token0: TokenType;
    token1: TokenType;
    closeDepositModal: () => void
}
const ReviewAddPosition: React.FC<ReviewAddPositionProps> = ({token0, token1, closeDepositModal}) => {
    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 mx-auto bg-black/75 p-10 flex justify-center items-center z-50">
            <div className="bg-zinc-800 rounded-xl p-4 border-[1px] border-zinc-500 flex gap-y-4 flex-col min-w-[300px]">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">Adding position</div>
                    <div><SVGClose className="w-7 h-7 hover:bg-zinc-700 active:bg-zinc-700/60 rounded-full p-1 cursor-pointer" onClick={closeDepositModal}/></div>
                </div>
                <div>
                    <div className="pb-2 text-sm">Deposit tokens:</div>
                    <div className="rounded-md bg-zinc-700/30 flex justify-between items-center mb-2">
                        <div className="text-sm p-2">
                            <div className="text-pink-600">1235888888888.666669999999999999999</div>
                            <div className="text-xs text-zinc-400">$12344</div>
                        </div>
                        <div><Token token={token0} imageSize={30}/></div>
                    </div>
                    <div className="rounded-md bg-zinc-700/30 flex justify-between items-center mb-2">
                        <div className="text-sm p-2">
                            <div className="text-pink-600">1573.1111</div>
                            <div className="text-xs text-zinc-400">$12344</div>
                        </div>
                        <div><Token token={token1} imageSize={30}/></div>
                    </div>
                    <AddPositionExecutor/>
                </div>
            </div>
        </div>
    )
}

export default ReviewAddPosition