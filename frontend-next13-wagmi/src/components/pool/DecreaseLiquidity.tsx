import { TokenType } from "@/lib/types";
import DexModal from "../common/DexModal"
import { useState } from "react";
import Setting from "../common/Setting"
import { Button } from "../ui/button"



type DEcreaseLiquidityProps = {
    token0: TokenType;
    token1: TokenType;
    token0Balance: string;
    token1Balance: string;
    closeDexModal: () => void
}
const DecreaseLiquidity: React.FC<DEcreaseLiquidityProps> = ({token0, token1, token0Balance, token1Balance,
                                                              closeDexModal}) => {
    const [settingOpen, setSettingOpen] = useState(false)
    const [removePercent, setRemovePercent] = useState<number | ''>(50)
    const [executed, setExecuted] = useState(false)


    const onSettingOpenChange = (open: boolean) => {
        setSettingOpen(open)
    }
    const handleRemovePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setRemovePercent(Number(e.target.value))
        } else {
            setRemovePercent('')
        } 
    }
    const handleRemovePercentOnBlur = () => {
        console.log('handleRemovePercentOnBlur')
        console.log('removePercent = ', removePercent)
        if (removePercent === 0 || removePercent === '') {
            setRemovePercent(50)
        }
    }

    const checkDisabled = () => {
        if (removePercent === '' || removePercent === 0) return true
        return false
    }

    const handlDecreaseLiquidity = () => {
        setExecuted(true)
    }

    return (
        <DexModal 
            onClick={closeDexModal} 
            title="Decreasing liquidity"
            other={<Setting settingOpen={settingOpen} onOpenChange={onSettingOpenChange}/>}>
            <div className="text-sm flex flex-col gap-2">
                <div><span className="mr-2">PositionId:</span><span>123456</span></div>
                <div><span className="mr-2">Total liquidity:</span><span>45898966666664</span></div>
                <div className="flex items-center">
                    <span className="mr-2">Percentage to remove:</span>
                    <div className="flex items-center">
                        <input type="number"
                                placeholder="50"
                                min={0}
                                max={100}
                                className="border-[1px] border-zinc-500 rounded-md w-10 px-2 py-1 text-xs text-pink-600 font-semibold mr-1"
                                value={removePercent}
                                onChange={handleRemovePercentChange}
                                onKeyDown={(event) => {
                                    const allow = (event?.key === 'Backspace' || event?.key === 'Delete')
                                                || event?.key >= '0' && event?.key <= '9' && Number(`${removePercent}${event?.key}`) <= 100
                                    if (!allow) {
                                        event.preventDefault();
                                    }
                                }}
                                onBlur={handleRemovePercentOnBlur}>
                        </input>
                        <span className="text-xs">% (0-100)</span>
                    </div>
                    
                </div>
                <div className='pt-4'>
                        <Button
                            className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600'
                            disabled={executed || checkDisabled()}
                            onClick={handlDecreaseLiquidity}
                        > 
                        <span>Decrease Liquidity</span>
                        </Button>
                </div>
            </div>
        </DexModal>
    )
}

export default DecreaseLiquidity