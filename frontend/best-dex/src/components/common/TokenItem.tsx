import type { TokenType } from "@/lib/types"
import ToolTipUtil from "./ToolTipUtil"
import { Divide } from "lucide-react"

type TokenItemProps = {
    token: TokenType
}

const TokenItem: React.FC<TokenItemProps> = ({token}) => {
    const content = <div>
                        <p><span>Symbol:</span>{token.symbol}</p>
                        <p><span>Address:</span>{token.address}</p>
                    </div>
    return (
        <ToolTipUtil content={<div><p>Symbol:{token.symbol}</p><p>Address: {token.address}</p></div>} align="start">
            <div className="flex items-center my-1">
                <img 
                    src={`/imgs/tokens/${token.name}.png`} 
                    alt={token.name}
                    width={25}
                    height={25} />
                <div className="ml-1">{token.symbol}</div>
            </div>   
        </ToolTipUtil>
    )
}

export default TokenItem