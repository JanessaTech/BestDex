import { Button } from "@/components/ui/button"
import type { TokenType } from "@/lib/types"
import { useAccount} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

type QuotesProps = {
    tokenFrom: TokenType | undefined ,
    tokenTo: TokenType | undefined,
    swapAmount: string
}
const Quotes:React.FC<QuotesProps> = ({tokenFrom, tokenTo, swapAmount}) => {
    const { isConnected } = useAccount()
    const { openConnectModal } = useConnectModal()

    const handleSwap = () => {

    }

    return (
        <div>
            <div className='flex justify-center'>
            <Button 
                className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600' 
                disabled={isConnected ? !tokenFrom || !tokenTo || !swapAmount : false}
                onClick={isConnected ? handleSwap : openConnectModal}>{isConnected ? 'Swap' :'Connect Wallet'}</Button>
            </div>
        </div>
    )
}

export default Quotes