import type { TokenType } from "@/lib/types"
import Image from "next/image"

type TokenProps = {
    token: TokenType | undefined;
    className?: string;
    imageSize: number;
    textSize?: string;
    defaultLabel?: string
}
const Token:React.FC<TokenProps> = ({token, className = 'flex items-center', imageSize, textSize = 'text-sm', defaultLabel = 'N/A'}) => {
    return (
        <div className={className}>
            {
                token ?<><Image src={`/imgs/tokens/${token?.alias}.png`} alt={token.symbol} width={imageSize} height={imageSize} className={`min-w-[${imageSize}px] rounded-full`}/><span className={`mx-2 truncate min-w-10 ${textSize}`}>{token.symbol}</span></> 
                : <><div className={`w-[${imageSize}px] h-[${imageSize}px] rounded-full bg-zinc-500 min-w-[${imageSize}px]`}></div><span className={`mx-2 truncate min-w-1 ${textSize}`}>{defaultLabel}</span></>
            }
        </div>
    )
}

export default Token