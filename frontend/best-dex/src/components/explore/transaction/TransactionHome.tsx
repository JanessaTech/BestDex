import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TransactionHomeProps = {}

const TransactionHome: React.FC<TransactionHomeProps> = () => {
    return (
        <TabsContent value="transactions">
            <div className="w-full h-16 bg-red-200 sticky top-16">
                header
            </div>
            <div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
                <div className="w-full h-10 bg-orange-400 my-2">row1</div>
            </div>
            
        </TabsContent>
    )
}

export default TransactionHome