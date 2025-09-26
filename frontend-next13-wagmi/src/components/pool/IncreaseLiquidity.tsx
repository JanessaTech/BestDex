import { useState } from "react"
import DexModal from "../common/DexModal"
import Setting from "../common/Setting"
import { useUpdateSetting } from "@/config/store"

type IncreaseLiquidityProps = {
    closeDexModal: () => void
}
const IncreaseLiquidity: React.FC<IncreaseLiquidityProps> = ({closeDexModal}) => {
    const [settingOpen, setSettingOpen] = useState(false)
    const {slipage, deadline} = useUpdateSetting()

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }

    return (
        <DexModal onClick={closeDexModal} title="Increasing liquidity" other={<Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>}>
            <div>
                <div className="text-sm"><span className="mr-2">Position ID:</span><span>123456</span></div>
                <div>
                    
                </div>
            </div>
        </DexModal>
    )
}

export default IncreaseLiquidity