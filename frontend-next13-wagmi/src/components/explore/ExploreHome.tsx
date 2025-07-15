'use client'

import { Tabs,TabsList, TabsTrigger } from "@/components/ui/tabs"
import PositionsHome from "./position/PositionsHome"
import TransactionsHome from "./transaction/TransactionsHome"

type ExploreHomeProps = {}
const ExploreHome:React.FC<ExploreHomeProps> = () => {

    return (
        <div>
            <div className='font-semibold text-xl my-10 md:hidden capitalize'>Explore</div>
            <Tabs defaultValue="positions" className="w-full mt-8">
                <TabsList className="bg-pink-600/25 text-white">
                    <TabsTrigger value="positions" className="text-zinc-300 data-[state=active]:bg-pink-600 data-[state=active]:text-white">Positions</TabsTrigger>
                    <TabsTrigger value="transactions" className="text-zinc-300 data-[state=active]:bg-pink-600 data-[state=active]:text-white">Transactions</TabsTrigger>
                </TabsList>
                <PositionsHome/>
                <TransactionsHome/>
            </Tabs>
        </div>
    )
}

export default ExploreHome