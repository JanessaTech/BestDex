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
import ToolTipHelper from "@/components/common/ToolTipHelper"
import Token from "@/components/common/Token"
import ArrowRightLeft from "@/lib/svgs/svg_arrow_rightleft"
import ArrowRight from "@/lib/svgs/svg_arrow_right"
import { TRANSACTION_TYPE } from "@/common/types"
import { useEffect, useState } from "react"
import { PaginationReturnType, TransactionInfoType } from "@/lib/client/types"
import logger from "@/common/Logger"
import { getTransactionsByPage } from "@/lib/client/Transaction"
import { useChainId, useAccount} from 'wagmi'
import { timeAgo } from "@/common/utils"


type TransactionsHomeProps = {}
const TransactionsHome: React.FC<TransactionsHomeProps> = () => {
    const chainId = useChainId()  
    const { address} = useAccount()

    const [pagination, setPagination] = useState<PaginationReturnType<TransactionInfoType[]>>()
    const [page, setPage] = useState(1)
    
    useEffect(() => {
        loadTransactionList()
    }, [])

    const loadTransactionList = async () => {
        logger.debug('[TransactionsHome] loadTransactionList. page=', page)
        const pagination = await getTransactionsByPage(chainId, address!, page)
        if (pagination) setPagination(pagination)
    }

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
                        pagination?.results.map((transaction, index) => (
                            <>
                                <TableRow key={index} className="border-zinc-400/40 hover:bg-muted/20">
                                    <TableCell>{timeAgo(transaction.createdAt)}</TableCell>
                                    <TableCell>
                                        <ToolTipHelper content={transaction.tx}>
                                            <div className="max-md:w-10 truncate">
                                                {transaction.tx}
                                            </div>
                                        </ToolTipHelper>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col items-center min-w-44">
                                            <span>{transaction.txType}</span>
                                            <div className="flex items-center">
                                                <span>(</span>
                                                    <Token token={transaction.token0} imageSize={20}/>
                                                {
                                                    transaction.txType as TRANSACTION_TYPE === TRANSACTION_TYPE.Swap ?  
                                                        <ArrowRight className="w-3 h-3 mx-1"/> : <ArrowRightLeft className="w-5 h-5 mx-1"/>
                                                }
                                                <Token token={transaction.token1} imageSize={20}/>
                                                <span>)</span>
                                            </div>
                                        </div>
                                        
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <div className="flex flex-col items-center">
                                            <div>${transaction.amount0}</div>
                                            <Token token={transaction.token0} imageSize={20}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`max-md:hidden`}>
                                        <div className="flex flex-col items-center">
                                            <div>${transaction.amount1}</div>
                                            <Token token={transaction.token1} imageSize={20}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right max-md:hidden">
                                        <span>${transaction.usd}</span>
                                    </TableCell>
                                    <TableCell className="text-center max-md:hidden">
                                        <ToolTipHelper content={<p><strong>Address:</strong> {transaction.from}</p>}>
                                            <div className="w-[100px] truncate">
                                                {transaction.from}
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