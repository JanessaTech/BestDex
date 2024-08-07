
'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GoUp from "@/lib/svgs/GoUp"
import ScrollToTop from "react-scroll-to-top"
import PositionHome from "./position/PositionHome"
import TransactionHome from "./transaction/TransactionHome"
import { useState } from "react"

type ExploreHomeProps = {}

const ExploreHome: React.FC<ExploreHomeProps> = () => {
    const [onlyMe, setOnlyMe] = useState<boolean>(false)

    const toggleOnlyMe = () => {
        setOnlyMe((pre) => !pre)
    }
    return (
        <div>
            <div className="font-semibold text-2xl">Explore</div>
            <Tabs defaultValue="positions" className="w-full mt-8">
                <div className="flex justify-between items-center">
                    <TabsList className="bg-zinc-600">
                        <TabsTrigger 
                            value="positions" 
                            className="text-zinc-300 data-[state=active]:bg-sky-600 data-[state=active]:text-white">Positions</TabsTrigger>
                        <TabsTrigger 
                            value="transactions" 
                            className="text-zinc-300 data-[state=active]:bg-sky-500 data-[state=active]:text-white">Transactions</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            checked={onlyMe} 
                            className="accent-red-600"
                            onChange={toggleOnlyMe}/>
                        <span className="text-sm ml-1 font-semibold">Only me</span>
                    </div>
                </div>
                <PositionHome/>
                <TransactionHome/>
            </Tabs>
            <ScrollToTop smooth component={<GoUp className="text-red-600"/>}/>
        </div>
    )
}

export default ExploreHome