import DexModal from "../common/DexModal"

type CollectFeeProps = {
    closeDexModal: () => void
}
const CollectFee: React.FC<CollectFeeProps> = ({closeDexModal}) => {
    return (
        <DexModal onClick={closeDexModal}>
            <div>IncreaseLiquidity</div>
        </DexModal>
    )
}

export default CollectFee