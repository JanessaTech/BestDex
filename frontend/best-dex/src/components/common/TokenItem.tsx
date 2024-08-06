import type { TokenType } from "@/lib/types"
import ToolTipUtil from "./ToolTipUtil"

type TokenItemProps = {
    token: TokenType
}

const TokenItem: React.FC<TokenItemProps> = ({token}) => {
    return (
        <ToolTipUtil content={`Address: ${token.address}`} align="start">
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