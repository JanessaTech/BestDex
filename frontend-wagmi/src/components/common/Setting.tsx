import {
    Popover,
    PopoverContent,
    PopoverTrigger,   
  } from "@/components/ui/popover"
import SVGClose from "@/lib/svgs/svg_close"
import SVGSetting from "@/lib/svgs/svg_setting"
import { useState } from "react"
import QuestionMarkToolTip from "./QuestionMarkToolTip"

type SettingProps = {
    settingOpen: boolean;
    onOpenChange: (open: boolean) => void;
}
const Setting:React.FC<SettingProps> = ({settingOpen, onOpenChange}) => {
    const [select, setSelect] = useState(2)
    const [custom, setCustom] = useState<string>('custom')
    const [deadline, setDeadline] = useState<number | ''>(10)

    const handleCustomClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (custom === 'custom') {
            setCustom('')
        }
        setSelect(4) 
    }

    const handleCustomOnBlur = () => {
        if (custom === '') {
            setCustom('custom')
            setSelect(2)
        }
    }

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustom(e.target.value)
    }

    const handleDeadlineOnBlur = () => {
        console.log('handleDeadlineOnBlur')
        console.log('deadline = ', deadline)
        if (deadline === 0 || deadline === '') {
            setDeadline(10)
        }
    }
    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setDeadline(Number(e.target.value))
        } else {
            setDeadline('')
        } 
    }

    return (
        <div>
            <Popover open={settingOpen} onOpenChange={onOpenChange}>
                <PopoverTrigger asChild>
                    <div><SVGSetting className="w-6 h-6 cursor-pointer hover:text-pink-600"/></div>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[250px] md:w-[400px]">
                    <div className="px-3 pb-2">
                        <div className="flex justify-end">
                            <SVGClose 
                                onClick={() => onOpenChange(false)}
                                className="text-zinc-600 p-1 w-7 h-7 hover:bg-zinc-300 cursor-pointer rounded-full"/>
                        </div>
                        <div>
                            <div>SWAP & LIQUIDITY</div>
                            <div className="flex items-center">
                                <div className="text-sm py-3 font-semibold">Slippage Tolerance</div>
                                <QuestionMarkToolTip>
                                    <div className="w-[200px] text-xs">Your transaction will revert if the price changes unfavorably by more than this percentage</div>
                                </QuestionMarkToolTip>
                            </div>
                            
                            <div className="flex items-center md:justify-between flex-wrap space-y-[2px] space-x-[10px]">
                                <div className={`border-[1px]  rounded-full cursor-pointer text-sm px-2 ${select=== 0 ? 'bg-pink-600 text-white' : 'border-zinc-400'}`} onClick={() => {setSelect(0); setCustom('custom')}}>0.01%</div>
                                <div className={`border-[1px]  rounded-full cursor-pointer text-sm px-2 ${select=== 1 ? 'bg-pink-600 text-white' : 'border-zinc-400'}`} onClick={() => {setSelect(1); setCustom('custom')}}>0.05%</div>
                                <div className={`border-[1px]  rounded-full cursor-pointer text-sm px-2 ${select=== 2 ? 'bg-pink-600 text-white' : 'border-zinc-400'}`} onClick={() => {setSelect(2); setCustom('custom')}}>0.30%</div>
                                <div className={`border-[1px]  rounded-full cursor-pointer text-sm px-2 ${select=== 3 ? 'bg-pink-600 text-white' : 'border-zinc-400'}`} onClick={() => {setSelect(3); setCustom('custom')}}>1.00%</div>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className={`w-[70px] px-2 text-sm h-full border-[1px] rounded-full ${select === 4 ? 'bg-pink-600 text-white' : 'border-zinc-400'}`}
                                        value={custom}
                                        onClick={handleCustomClick}
                                        onBlur={handleCustomOnBlur}
                                        onChange={handleCustomChange}
                                        onKeyDown={(event) => {
                                            const allow = (event?.key === 'Backspace' || event?.key === 'Delete')
                                                        || (custom === '' && event?.key >= '0' && event?.key <= '9')
                                                        || (custom === '0' && event?.key === '.')
                                                        || (custom.length === 1 && custom >= '1' && custom <= '9' && event?.key === '.')
                                                        || (/^\d.$/.test(custom) && event?.key >= '0' && event?.key <= '9')
                                                        || (/^\d.\d$/.test(custom) && event?.key >= '0' && event?.key <= '9')
                                                if (!allow) {
                                                    event.preventDefault(); 
                                                }
                                        }}
                                    />
                                    <span className="absolute text-sm right-[16px] top-[2px] text-white">{custom === 'custom' ? '' : '%'}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="text-sm py-3 font-semibold">Transaction Deadline</div>
                                <QuestionMarkToolTip>
                                    <div className="w-[200px] text-xs">Your transaction will revert if it is pending for more than this period of time</div>
                                </QuestionMarkToolTip>
                            </div>
                            
                            <div className="flex items-center">
                                <input type="number"
                                    className="border-[1px] border-zinc-500 rounded-md w-14 px-2 py-1 text-xs"
                                    placeholder="10"
                                    value={`${deadline}`}
                                    onChange={handleDeadlineChange}
                                    onKeyDown={(event) => {
                                        const allow = (event?.key === 'Backspace' || event?.key === 'Delete')
                                                    || event?.key >= '0' && event?.key <= '9' && Number(`${deadline}${event?.key}`) <= 4000
                                        if (!allow) {
                                            event.preventDefault();
                                        }
                                    }}
                                    onBlur={handleDeadlineOnBlur}
                                    />
                                <span className="text-xs ml-2">minutes</span>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default Setting