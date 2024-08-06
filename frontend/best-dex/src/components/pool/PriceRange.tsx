import type { TokenType } from "@/lib/types"

type PriceRangeProps = {
    label: string,
    price: number | '',
    onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    token0: TokenType | undefined,
    token1: TokenType | undefined,
}

const PriceRange: React.FC<PriceRangeProps> = ({label, price, onPriceChange, token0, token1}) => {
    return (
        <div className="relative mb-2">
            <input 
                id={label}
                name={label}
                type="number" 
                className="rounded-md h-20 w-full border border-zinc-300 
                text-black text-lg px-3"
                value={price}
                onChange={onPriceChange}
                placeholder="0"
                onKeyDown={(event) => {
                    if (event?.key === '+' || event?.key === '-') {
                        event.preventDefault()
                    }
                }}
                onWheelCapture={(e) => {
                    e.currentTarget.blur()
                }}
            />
            <span className="text-xs text-zinc-400 absolute top-1 left-3">Low price</span>
            <span className="text-xs text-zinc-400 absolute bottom-1 left-3">
                {token0 && token1 ? 
                    `${token1?.symbol} per ${token0?.symbol}`: token0 ?  `per ${token0?.symbol}`: ''}
            </span>
        </div>
    )
}

export default PriceRange