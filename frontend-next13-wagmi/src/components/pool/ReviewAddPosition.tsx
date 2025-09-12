import SVGClose from "@/lib/svgs/svg_close"
import { TokenType ,LocalChainIds} from "@/lib/types";
import Token from "../common/Token";
import AddPositionExecutor from "./AddPositionExecutor";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useEffect, useState } from "react";
import SVGCheck from "@/lib/svgs/svg_check";
import { useChainId} from 'wagmi'
import { ChainId } from '@uniswap/sdk-core'
import { Decimal } from 'decimal.js'
import QuestionMarkToolTip from "../common/QuestionMarkToolTip";

type AddSuccessProps = {
    token0: TokenType;
    token1: TokenType;
}
const AddSuccess:React.FC<AddSuccessProps> = ({token0, token1}) => {
    return (
        <div>
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
                    <span className="text-pink-600 pr-2">0.00002457893999999999999999999</span>
                    <Token token={token0} imageSize={20}/>
                </div>
                <div className="flex">
                    <span className="text-pink-600 pr-2">157899</span>
                    <Token token={token1} imageSize={20}/>
                </div>
            </div>
        </div>
        
    )
}
type ReviewAddPositionProps = {
    token0: TokenType;
    token1: TokenType;
    token0Input:string;
    token1Input:string;
    token0Desired:string;
    token1Desired:string;
    closeAddPositionModal: () => void
}
const ReviewAddPosition: React.FC<ReviewAddPositionProps> = ({token0, token1, token0Input, token1Input,
                                                              token0Desired, token1Desired,
                                                              closeAddPositionModal}) => {
    const [showSuccess, setShowSuccess] = useState(true)
    const [tokensUSD, setTokensUSD] = useState<{token0: string, token1: string}>({token0: '0', token1: '0'})
    const {tokenPrices} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)

    useEffect(() => {
        updateUSD()
    }, [])

    const updateUSD = () => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test
        const price0 = tokenPrices[targetChainId]?.get(token0.address)
        const price1 = tokenPrices[targetChainId]?.get(token1.address)
        let token0USD = '0'
        let token1USD = '0'
        
        if (price0) {
            token0USD = new Decimal(price0).times(token0Input ? new Decimal(token0Input) : 0).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        }
        if (price1) {
            token1USD = new Decimal(price1).times(token1Input ? new Decimal(token1Input) : 0).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        }
        console.log(`token0Input=${token0Input}, token1Input=${token1Input}, price0=${price0?.toString()}, price1=${price1?.toString()}`)
        setTokensUSD({token0: token0USD, token1: token1USD})
    }

    const handleAddSuccess = () => {
        setShowSuccess(true)
    }
    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 mx-auto bg-black/75 p-10 flex justify-center items-center z-50">
            <div className="bg-zinc-800 rounded-xl p-4 border-[1px] border-zinc-500 flex gap-y-4 flex-col min-w-[300px]">
                <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">Adding position</div>
                    <div><SVGClose className="w-7 h-7 hover:bg-zinc-700 active:bg-zinc-700/60 rounded-full p-1 cursor-pointer" onClick={closeAddPositionModal}/></div>
                </div>
                {
                    showSuccess
                    ? <AddSuccess token0={token0} token1={token1}/>
                    : <div>
                        <div className="pb-2 text-sm">Deposit tokens:</div>
                        <div className="rounded-md bg-zinc-700/30 flex justify-between items-center mb-2">
                            <div className="text-sm p-2">
                                <div className="text-pink-600">${token0Input}</div>
                                <div className="text-xs text-zinc-400">${tokensUSD.token0}</div>
                            </div>
                            <div><Token token={token0} imageSize={30}/></div>
                        </div>
                        <div className="rounded-md bg-zinc-700/30 flex justify-between items-center mb-2">
                            <div className="text-sm p-2">
                                <div className="text-pink-600">${token1Input}</div>
                                <div className="text-xs text-zinc-400">${tokensUSD.token1}</div>
                            </div>
                            <div><Token token={token1} imageSize={30}/></div>
                        </div>
                        <AddPositionExecutor handleAddSuccess={handleAddSuccess}/>
                      </div>
                }
            </div>
        </div>
    )
}

export default ReviewAddPosition