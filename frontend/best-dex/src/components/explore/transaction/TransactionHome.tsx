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
import { TransactionListData } from "@/lib/constants"
import { TransactionType } from "@/lib/types"
import ToolTipUtil from "@/components/common/ToolTipUtil"
import TokenItem from "@/components/common/TokenItem"
import ThreeLineArrow from "@/lib/svgs/ThreeLineArrow"
import Joint from "@/lib/svgs/Joint"

type TransactionHomeProps = {}

const TransactionHome: React.FC<TransactionHomeProps> = () => {
    return (
        <TabsContent value="transactions">
            <Table>
                <TableCaption>A list of recent transactions.</TableCaption>
                <TableHeader className="bg-zinc-700 sticky top-16">
                    <TableRow>
                        <TableHead className="text-white font-bold">Time</TableHead>
                        <TableHead className="text-white font-bold">Transaction ID</TableHead>
                        <TableHead className="text-white font-bold text-center">Type</TableHead>
                        <TableHead className="text-white font-bold text-center">Token amount</TableHead>
                        <TableHead className="text-white font-bold text-center">Token amount</TableHead>
                        <TableHead className="text-white font-bold text-center">USD</TableHead>
                        <TableHead className="text-center text-white">Wallet</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        TransactionListData.map((transaction, index) => (
                            <TableRow key={index} className="border-zinc-400/40 hover:bg-muted/20">
                                <TableCell>{transaction.time}</TableCell>
                                <TableCell>
                                    <ToolTipUtil content={transaction.tx}>
                                        <div className="w-[100px] truncate">
                                            {transaction.tx}
                                        </div>
                                    </ToolTipUtil>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col items-center min-w-44">
                                        <span>{TransactionType[transaction.type]}</span>
                                        <div className="flex items-center">
                                            <span>(</span>
                                            <TokenItem token={transaction.token0}/>
                                            {
                                                transaction.type as TransactionType === TransactionType.Swap ?  
                                                    <ThreeLineArrow className="w-3 h-3 mx-1"/> : <Joint className="w-5 h-5 mx-1"/>
                                            }
                                            <TokenItem token={transaction.token1}/>
                                            <span>)</span>
                                        </div>
                                    </div>
                                    
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col items-center">
                                        <div>${transaction.token0Amount}</div>
                                        <TokenItem token={transaction.token1}/>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col items-center">
                                        <div>${transaction.token1Amount}</div>
                                        <TokenItem token={transaction.token0}/>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    $123
                                </TableCell>
                                <TableCell className="text-center">
                                    <ToolTipUtil content={<p><strong>Address:</strong> ${transaction.wallet}</p>}>
                                        <div className="w-[100px] truncate">
                                            {transaction.wallet}
                                        </div>
                                    </ToolTipUtil></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TabsContent>
    )
}

export default TransactionHome