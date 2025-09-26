import { TokenType } from "@/lib/types";
import DexModal from "../common/DexModal"

type DEcreaseLiquidityProps = {
    token0: TokenType;
    token1: TokenType;
    token0Balance: string;
    token1Balance: string;
    closeDexModal: () => void
}
const DecreaseLiquidity: React.FC<DEcreaseLiquidityProps> = ({token0, token1, token0Balance, token1Balance,
                                                              closeDexModal}) => {
    return (
        <DexModal onClick={closeDexModal} title="Decreasing liquidity">
            <div>DecreaseLiquidity</div>
        </DexModal>
    )
}

export default DecreaseLiquidity