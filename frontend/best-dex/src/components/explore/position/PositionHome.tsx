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

type PositionHomeProps = {}

const PositionHome: React.FC<PositionHomeProps> = () => {
    return (
    <TabsContent value="positions">
        <div className="sticky top-16 z-10">
            <Table>
                <TableHeader className="bg-zinc-700">
                    <TableRow>
                        <TableHead className="text-white font-bold">Position ID</TableHead>
                        <TableHead className="text-white font-bold">Token0<br/>Token1</TableHead>
                        <TableHead className="text-white font-bold">Ticks</TableHead>
                        <TableHead className="text-white font-bold w-[50px]">Liquidity</TableHead>
                        <TableHead className="text-white font-bold text-right">Status</TableHead>
                        <TableHead className="text-white font-bold text-center">Fee</TableHead>
                        <TableHead className="text-white font-bold text-center">Wallet</TableHead>
                        <TableHead className="text-right text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
        </div>
        <Table>
            <TableCaption>A list of recent positions.</TableCaption>
            <TableBody>
                {
                    PositionListData.map((position) => (
                        <>
                            <TableRow className="border-zinc-400/40 hover:bg-muted/20">
                                <TableCell className="font-medium ">{position.id}</TableCell>
                                <TableCell>
                                    <div>
                                        <div className="flex items-center my-1">
                                            <img 
                                                src={`/imgs/tokens/${position.token0.name}.png`} 
                                                alt={position.token0.name}
                                                width={25}
                                                height={25} />
                                            <div className="ml-1">{position.token0.symbol}</div>
                                        </div>
                                        <div className="flex items-center my-1">
                                            <img 
                                                src={`/imgs/tokens/${position.token1.name}.png`} 
                                                alt={position.token1.name}
                                                width={25}
                                                height={25} />
                                            <div className="ml-1">{position.token1.symbol}</div>
                                        </div>
                                        
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
                                    <div className={`w-3 h-3 rounded-full ${position.status ? 'bg-lime-500' : 'bg-red-500'}`}/>
                                </TableCell>
                                <TableCell>{position.fee}%</TableCell>
                                <TableCell>
                                    <ToolTipUtil content={position.wallet}>
                                        <>
                                            <div className="w-[100px] truncate">{position.wallet}</div>
                                            <div className="text-sky-500 font-semibold">me</div>
                                        </>
                                    </ToolTipUtil>
                                </TableCell>
                                <TableCell className="text-right">
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