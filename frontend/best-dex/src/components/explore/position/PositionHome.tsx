import {TabsContent} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
import { PositionListData } from "@/lib/constants"
import Add from "@/lib/svgs/Add"
import Withdraw from "@/lib/svgs/Withdraw"
import Delete from "@/lib/svgs/Delete"
import ToolTipUtil from "@/components/common/ToolTipUtil"
import TokenItem from "@/components/common/TokenItem"

type PositionHomeProps = {}

const PositionHome: React.FC<PositionHomeProps> = () => {
    return (
    <TabsContent value="positions">
        <Table>
            <TableCaption>A list of recent positions.</TableCaption>
            <TableHeader className="bg-zinc-700 sticky top-16">
                <TableRow>
                    <TableHead className="text-white font-bold">Position ID</TableHead>
                    <TableHead className="text-white font-bold">Token0<br/>Token1</TableHead>
                    <TableHead className="text-white font-bold">Ticks</TableHead>
                    <TableHead className="text-white font-bold">Liquidity</TableHead>
                    <TableHead className="text-white font-bold">Status</TableHead>
                    <TableHead className="text-white font-bold">Fee</TableHead>
                    <TableHead className="text-white font-bold">Wallet</TableHead>
                    <TableHead className="text-center text-white">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    PositionListData.map((position) => (
                        <>
                            <TableRow className="border-zinc-400/40 hover:bg-muted/20">
                                <TableCell className="font-medium ">{position.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <TokenItem token={position.token0}/>
                                        <TokenItem token={position.token1}/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div><span className="font-bold">Low:</span>{position.lowTick}</div>
                                        <div><span className="font-bold">High:</span>{position.highTick}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <ToolTipUtil content={`${position.liquidity}`}>
                                        <div className="w-[100px] truncate">{position.liquidity}</div>
                                    </ToolTipUtil>
                                </TableCell>
                                <TableCell>   
                                    <ToolTipUtil content={`${position.status ? 'In range': 'Out of range'}`}>
                                        <div className={`w-3 h-3 rounded-full ${position.status ? 'bg-lime-500' : 'bg-red-500'}`}/>
                                    </ToolTipUtil>                                
                                    
                                </TableCell>
                                <TableCell>{position.fee}%</TableCell>
                                <TableCell>
                                    <ToolTipUtil content={`Address: ${position.wallet}`}>
                                        <>
                                            <div className="w-[100px] truncate">{position.wallet}</div>
                                            <div className="text-sky-500 font-semibold">me</div>
                                        </>
                                    </ToolTipUtil>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div>
                                        <div>
                                            <ToolTipUtil content="Increase liquidlity">
                                                <Add className="cursor-pointer w-5 h-5 hover:text-sky-500"/>
                                            </ToolTipUtil>                                                               
                                        </div>
                                        <div>
                                            <ToolTipUtil content="Collect fee">
                                                <Withdraw className="cursor-pointer w-5 h-5 hover:text-sky-500"/>
                                            </ToolTipUtil>                                            
                                        </div>
                                        <div>
                                            <ToolTipUtil content="Delete position">
                                                <Delete className="cursor-pointer w-5 h-5 hover:text-sky-500"/>
                                            </ToolTipUtil>
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
    )
}

export default PositionHome