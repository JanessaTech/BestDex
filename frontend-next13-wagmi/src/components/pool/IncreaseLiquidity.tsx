import DexModal from "../common/DexModal"

type IncreaseLiquidityProps = {
    closeDexModal: () => void
}
const IncreaseLiquidity: React.FC<IncreaseLiquidityProps> = ({closeDexModal}) => {
    return (
        <DexModal onClick={closeDexModal} title="Increasing liquidity">
            <div>IncreaseLiquidity</div>
        </DexModal>
    )
}

export default IncreaseLiquidity