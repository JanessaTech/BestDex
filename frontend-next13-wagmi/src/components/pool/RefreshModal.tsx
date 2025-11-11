import SVGRefresh from "@/lib/svgs/svg_refresh"
import DexModal from "../common/DexModal"

type RefreshModalProps = {
    closeRefreshModal: () => void
}
const RefreshModal:React.FC<RefreshModalProps> = ({closeRefreshModal}) => {
    return (
        <div>
            <DexModal onClick={closeRefreshModal} title="Please refresh">
                <div className="flex justify-center items-center mb-10 text-sm">
                    <span>Please refresh by clicking</span>
                    <SVGRefresh className="size-6 text-pink-600 px-1"/>
                    <span>button on the top</span>
                </div>
            </DexModal>
        </div>
    )
}

export default RefreshModal