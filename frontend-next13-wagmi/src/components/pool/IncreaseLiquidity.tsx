import { useState } from "react"
import DexModal from "../common/DexModal"
import Setting from "../common/Setting"
import { useUpdateSetting } from "@/config/store"
import DepositInput from "./DepositInput"
import { TokenType } from "@/lib/types"

type IncreaseLiquidityProps = {
    token0: TokenType;
    token1: TokenType;
    token0Balance: string;
    token1Balance: string;
    closeDexModal: () => void
}
const IncreaseLiquidity: React.FC<IncreaseLiquidityProps> = ({token0, token1, token0Balance, token1Balance,
                                                                closeDexModal}) => {
    const [settingOpen, setSettingOpen] = useState(false)
    const {slipage, deadline} = useUpdateSetting()
    const [deposit, setDeposit] = useState({amount0: '', amount1: ''})

    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }

    const handleDepositChanges = (amount0: string, amount1: string) => {
        setDeposit({...deposit, amount0: amount0, amount1: amount1})
    }

    const updateToken0Change = (value: string) => {
        handleDepositChanges(value, '')
    }

    const updateToken1Change = (value: string) => {
        handleDepositChanges('', value)
    }

    return (
        <DexModal 
                onClick={closeDexModal} 
                title="Increasing liquidity" 
                other={<Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>}>
            <div>
                <div className="text-sm"><span className="mr-2">Position ID:</span><span>123456</span></div>
                <div>
                    <div>  
                        <DepositInput 
                            token={token0} tokenBalance={token0Balance} amount={deposit.amount0}
                            updateTokenChange={updateToken0Change}/>
                    </div>
                    <div>  
                        <DepositInput 
                            token={token1} tokenBalance={token1Balance} amount={deposit.amount1}
                            updateTokenChange={updateToken1Change}/>
                    </div>
                </div>
            </div>
        </DexModal>
    )
}

export default IncreaseLiquidity