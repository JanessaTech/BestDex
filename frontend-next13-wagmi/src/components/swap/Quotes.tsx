import { Button } from "@/components/ui/button"
import type { TokenType } from "@/lib/types"
import { useAccount} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useReadContract } from "wagmi"
import { computePoolAddress } from '@uniswap/v3-sdk'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

type QuotesProps = {
    tokenFrom: TokenType | undefined ,
    tokenTo: TokenType | undefined,
    swapAmount: string
}
const Quotes:React.FC<QuotesProps> = ({tokenFrom, tokenTo, swapAmount}) => {
    const { isConnected } = useAccount()
    const { openConnectModal } = useConnectModal()

    async function getPoolConstants(): Promise<{
    token0: string
    token1: string
    fee: number
    }> {
        return null
    }

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