'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { BalanceListData } from "@/lib/constants"
import TokenItem from "../common/TokenItem"
import ScrollToTop from "react-scroll-to-top"
import GoUp from "@/lib/svgs/GoUp"

type BalanceHomeProps = {}

const BalanceHome: React.FC<BalanceHomeProps> = () => {
    return (
        <div>
            <div className="font-semibold text-2xl">My balance</div>
            <div className="my-8">
                <span className="font-bold">Account:</span>
                <span className="text-sky-500">0xb129c8aD40e31bC421F37b5B418CF1Bfe1175536</span>
            </div>
            <Table>
                <TableCaption>A list of token balances.</TableCaption>
                <TableHeader className="bg-zinc-700 sticky top-16">
                    <TableRow>
                        <TableHead className="text-white font-bold">Token</TableHead>
                        <TableHead className="text-white font-bold">Balance</TableHead>
                        <TableHead className="text-white font-bold">Price</TableHead>
                        <TableHead className="text-white font-bold text-center">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        BalanceListData.map((balance) => (
                        <TableRow className="border-zinc-400/40 hover:bg-muted/20">
                            <TableCell>
                                <TokenItem token={balance.token}/>
                            </TableCell>
                            <TableCell>{balance.balance}</TableCell>
                            <TableCell>{balance.price}</TableCell>
                            <TableCell className="text-center">${balance.total}</TableCell>
                        </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <ScrollToTop smooth component={<GoUp className="text-red-600"/>}/>
        </div>
    )
}

export default BalanceHome