import DexModal from "../common/DexModal"

type DEcreaseLiquidityProps = {
    closeDexModal: () => void
}
const DecreaseLiquidity: React.FC<DEcreaseLiquidityProps> = ({closeDexModal}) => {
    return (
        <DexModal onClick={closeDexModal} title="Decreasing liquidity">
            <div>DecreaseLiquidity</div>
        </DexModal>
    )
}

export default DecreaseLiquidity