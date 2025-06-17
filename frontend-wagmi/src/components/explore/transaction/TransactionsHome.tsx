import { TabsContent} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { TransactionListData } from "@/lib/Data"
import ToolTipHelper from "@/components/common/ToolTipHelper"
import Token from "@/components/common/Token"
import { TransactionType } from "@/lib/types"
import ArrowRightLeft from "@/lib/svgs/svg_arrow_rightleft"
import ArrowRight from "@/lib/svgs/svg_arrow_right"


type TransactionsHomeProps = {}
const TransactionsHome: React.FC<TransactionsHomeProps> = () => {
    return (
        <TabsContent value="transactions">
            <Table>
                <TableCaption>A list of recent transactions.</TableCaption>
                <TableHeader className="bg-zinc-700 sticky top-16">
                    <TableRow>
                        <TableHead className="text-white font-bold">Time</TableHead>
                        <TableHead className="text-white font-bold">Tx ID</TableHead>
                        <TableHead className="text-white font-bold text-center">Type</TableHead>
                        <TableHead className={`text-white font-bold text-center max-md:hidden`}>Token amount</TableHead>
                        <TableHead className={`text-white font-bold text-center max-md:hidden`}>Token amount</TableHead>
                        <TableHead className={`text-white font-bold text-center max-md:hidden`}>USD</TableHead>
                        <TableHead className={`text-white font-bold text-center max-md:hidden`}>Wallet</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        TransactionListData.map((transaction, index) => (
                            <>
                                <TableRow key={index} className="border-zinc-400/40 hover:bg-muted/20">
                                    <TableCell>{transaction.time}</TableCell>
                                    <TableCell>
                                        <ToolTipHelper content={transaction.tx}>
                                            <div className="max-md:w-10 truncate">
                                                {transaction.tx}
                                            </div>
                                        </ToolTipHelper>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-center min-w-44">
                                            <span>{TransactionType[transaction.type]}</span>
                                            <div className="flex items-center">
                                                <span>(</span>
                                                    <Token token={transaction.token0} imageSize={20}/>
                                                {
                                                    transaction.type as TransactionType === TransactionType.Swap ?  
                                                        <ArrowRight className="w-3 h-3 mx-1"/> : <ArrowRightLeft className="w-5 h-5 mx-1"/>
                                                }
                                                <Token token={transaction.token1} imageSize={20}/>
                                                <span>)</span>
                                            </div>
                                        </div>
                                        
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <div className="flex flex-col items-center">
                                            <div>${transaction.token0Amount}</div>
                                            <Token token={transaction.token1} imageSize={20}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <div className="flex flex-col items-center">
                                            <div>${transaction.token1Amount}</div>
                                            <Token token={transaction.token0} imageSize={20}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right max-md:hidden">
                                        $123
                                    </TableCell>
                                    <TableCell className="text-center max-md:hidden">
                                        <ToolTipHelper content={<p><strong>Address:</strong> {transaction.wallet}</p>}>
                                            <div className="w-[100px] truncate">
                                                {transaction.wallet}
                                            </div>
                                        </ToolTipHelper></TableCell>
                                </TableRow>
                            </>
                            
                        ))
                    }
                </TableBody>
            </Table>
        </TabsContent>
    )
}

export default TransactionsHome