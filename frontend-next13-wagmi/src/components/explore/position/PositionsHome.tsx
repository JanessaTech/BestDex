import { TabsContent} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import SVGPlus from "@/lib/svgs/svg_plus"
import SVGMinus from "@/lib/svgs/svg_minus"
import SVGWithdraw from "@/lib/svgs/svg_withdraw"
import Token from "@/components/common/Token"
import ToolTipHelper from "@/components/common/ToolTipHelper"
import { PositionListData } from "@/lib/data"
import { useState } from "react"
import IncreaseLiquidity from "@/components/pool/IncreaseLiquidity"
import DecreaseLiquidity from "@/components/pool/DecreaseLiquidity"
import CollectFee from "@/components/pool/CollectFee"
import { TokenType } from "@/lib/types"

type GlobalType = {
    token0?: TokenType;
    token1?: TokenType
}
type PositionsHomeProps = {}
const PositionsHome: React.FC<PositionsHomeProps> = () => {
    const [openIncreaseLiquidity, setOpenIncreaseLiquidity] = useState(false)
    const [openDecreaseLiquidity, setOpenDecreaseLiquidity] = useState(false)
    const [openCollectFee, setOpenCollectFee] = useState(false)
    const [global, setGlobal] = useState<GlobalType>({})

    const [tokenBalances, setTokenBalances] = useState<{token0: string, token1: string}>({token0: '999999999999999999999', token1: '999999999999999999'})
    
    const closeIncreaseLiquidityModal = () => {
        setOpenIncreaseLiquidity(false)
    }

    const closeDecreaseLiquidity = () => {
        setOpenDecreaseLiquidity(false)
    }

    const closeCollectFee = () => {
        setOpenCollectFee(false)
    }

    const handleOpenIncreaseLiquidity = (token0: TokenType, token1: TokenType,) => {
        setOpenIncreaseLiquidity(true)
        setGlobal({...global, token0: token0, token1: token1})
    }

    return (
        <div>
            <TabsContent value="positions">
                <Table>
                    <TableCaption>A list of recent positions.</TableCaption>
                    <TableHeader className="bg-zinc-700 sticky top-20">
                        <TableRow>
                            <TableHead className="text-white font-bold">Position ID</TableHead>
                            <TableHead className="text-white font-bold">Token0<br/>Token1</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Ticks</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Liquidity</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Status</TableHead>
                            <TableHead className="text-white font-bold">Fee</TableHead>
                            <TableHead className={`text-white font-bold max-md:hidden`}>Wallet</TableHead>
                            <TableHead className="text-center text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        PositionListData.map((position, index) => (
                            <>
                                <TableRow key={index} className="border-zinc-400/40 hover:bg-muted/20">
                                    <TableCell className="font-medium ">{position.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col space-y-1">
                                            <Token token={position.token0} imageSize={20}/>
                                            <Token token={position.token1} imageSize={20}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <div>
                                            <div><span className="font-bold">Low:</span>{position.lowTick}</div>
                                            <div><span className="font-bold">High:</span>{position.highTick}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <ToolTipHelper content={`${position.liquidity}`}>
                                            <div className="w-[100px] truncate">{position.liquidity}</div>
                                        </ToolTipHelper>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>   
                                        <ToolTipHelper content={`${position.status ? 'In range': 'Out of range'}`}>
                                            <div className={`w-3 h-3 rounded-full ${position.status ? 'bg-lime-500' : 'bg-red-500'}`}/>
                                        </ToolTipHelper>                                
                                        
                                    </TableCell>
                                    <TableCell>{position.fee}%</TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <ToolTipHelper content={<p><strong>Address : </strong>{position.wallet}</p>}>
                                            <div className="w-[78px] truncate">{position.wallet}</div>
                                        </ToolTipHelper>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div>
                                            <div>
                                                <ToolTipHelper content="Increase liquidlity">
                                                    <SVGPlus className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                            onClick={() => handleOpenIncreaseLiquidity(position.token0, position.token1)}/>
                                                </ToolTipHelper>                                                               
                                            </div>
                                            <div>
                                                <ToolTipHelper content="Delete position">
                                                    <SVGMinus className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                            onClick={() => setOpenDecreaseLiquidity(true)}/>
                                                </ToolTipHelper>
                                            </div>
                                            <div>
                                                <ToolTipHelper content="Collect fee">
                                                    <SVGWithdraw className="cursor-pointer w-5 h-5 hover:text-pink-600" 
                                                                onClick={() => setOpenCollectFee(true)}/>
                                                </ToolTipHelper>                                            
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))
                    }
                    </TableBody>
                </Table>
            </TabsContent>
            {
                openIncreaseLiquidity  && global.token0 && global.token1 && <IncreaseLiquidity
                                            token0={global.token0} token1={global.token1}
                                            token0Balance={tokenBalances.token0} token1Balance={tokenBalances.token1}
                                            closeDexModal={closeIncreaseLiquidityModal}/>
            }
            {
                openDecreaseLiquidity && global.token0 && global.token1 &&<DecreaseLiquidity 
                                            token0={global.token0} token1={global.token1}
                                            token0Balance={tokenBalances.token0} token1Balance={tokenBalances.token1}
                                            closeDexModal={closeDecreaseLiquidity}/>
            }
            {
                openCollectFee && <CollectFee closeDexModal={closeCollectFee}/>
            }
        </div>
    )
}

export default PositionsHome