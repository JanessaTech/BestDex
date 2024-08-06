import type { TokenType } from "@/lib/types"
import ToolTipUtil from "./ToolTipUtil"
import { Divide } from "lucide-react"

type TokenItemProps = {
    token: TokenType
}

const TokenItem: React.FC<TokenItemProps> = ({token}) => {
    const content = <div>
                        <p><strong>Symbol:</strong>{token.symbol}</p>
                        <p><strong>Address:</strong>{token.address}</p>
                    </div>
    return (
        <ToolTipUtil content={content} align="start">
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