import type { TokenType } from "@/lib/types"

type CurrentPriceProps = {
    currentPrice: number,
    token0: TokenType | undefined,
    token1: TokenType | undefined,
}

const CurrentPrice: React.FC<CurrentPriceProps> = ({currentPrice, token0, token1}) => {
    return (
        <>
        <div>Current price</div>
            <div className="text-xl text-sky-500">{currentPrice}</div>
            <div>{token0 && token1 ? 
                        `${token1?.symbol} per ${token0?.symbol}`: token0 ?  `per ${token0?.symbol}`: ''}
        </div>
        </>
    )
}

export default CurrentPrice