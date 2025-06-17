import { TabsContent} from "@/components/ui/tabs"


type TransactionsHomeProps = {}
const TransactionsHome: React.FC<TransactionsHomeProps> = () => {
    return (
        <TabsContent value="transactions">show your transactions here.</TabsContent>
    )
}

export default TransactionsHome