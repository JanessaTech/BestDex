import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import CustomTooltip from "../common/QuestionMarkToolTip"
import { useState } from "react"
import { PopoverClose } from "@radix-ui/react-popover"
import Close from "@/lib/svgs/Close"
import QuestionMarkToolTip from "../common/QuestionMarkToolTip"


type SettingPopover = {
    open: boolean,
    showCustom?: boolean
    onOpenChange: (open: boolean) => void
}

const SettingPopover: React.FC<SettingPopover> = ({open, showCustom, onOpenChange}) => {
    const [custom, setCustom] = useState<string>('custom')
    const [selected, setSelected] = useState<number>(2)
    const [deadline, setDeadline] = useState<number | ''>(10)

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustom(e.target.value)
    }

    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleDeadlineChange =', e.target.value)
        if (e.target.value !== '') {
            setDeadline(Number(e.target.value))
        } else {
            setDeadline('')
        } 
    }

    const handleCustomOnBlur = () => {
        if (custom === '') {
            setCustom('custom')
            setSelected(3)
        }
    }

    const handleDeadlineOnBlur = () => {
        console.log('handleDeadlineOnBlur')
        console.log('deadline = ', deadline)
        if (deadline === 0 || deadline === '') {
            setDeadline(10)
        }
    }

    const handleCustomClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (custom === 'custom') {
            setCustom('')
        }
        setSelected(4) 
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange} modal={true}>
             <PopoverTrigger>
                <img src="/imgs/setting.svg" alt="setting" className="ml-3 cursor-pointer"/>
             </PopoverTrigger>
             <PopoverContent align="end" className="w-[250px] md:w-[400px] py-4">
                <div className="flex justify-end">
                    <PopoverClose>
                        <Close className="text-zinc-500 hover:text-zinc-700 active:text-zinc-900 w-[20px] h-[20px]"/> 
                    </PopoverClose>
                </div>
                
                <div className="text-black">
                    <div className="mb-5">SWAP & LIQUIDITY</div>
                    <div className="flex">
                        <div className="font-semibold mr-2 text-sm">Slippage Tolerance</div>
                        <QuestionMarkToolTip>
                            <div className="w-[200px] text-xs">Your transaction will revert if the price changes unfavorably by more than this percentage</div>
                        </QuestionMarkToolTip>
                    </div>
                    <div className="flex my-3 items-center md:justify-between flex-wrap space-y-[2px] space-x-[10px]">
                        <div className={`rounded-full text-sm ${selected === 0 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(0)}>0.01%</div>
                        <div className={`rounded-full text-sm ${selected === 1 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(1)}>0.05%</div>
                        <div className={`rounded-full text-sm ${selected === 2 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(2)}>0.30%</div>
                        <div className={`rounded-full text-sm ${selected === 3 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(3)}>1.00%</div>
                        {
                            showCustom && <div className="relative">
                            <input type="text"
                                    className={`rounded-full text-sm ${selected === 4 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                            border border-zinc-300 px-2
                                            cursor-pointer w-[70px]`}
                                    value={custom}
                                    onClick={handleCustomClick}
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
                                    onBlur={handleCustomOnBlur}
                                    />
                            <span className="absolute text-sm right-[6px] top-[2px]">{custom === 'custom' ? '' : '%'}</span>
                        </div>
                        } 
                    </div>
                    <div className="flex mt-5">
                        <div className="font-semibold mr-2 text-sm">Transaction Deadline</div>
                        <QuestionMarkToolTip>
                            <div className="w-[200px] text-xs">Your transaction will revert if it is pending for more than this period of time</div>
                        </QuestionMarkToolTip>
                    </div>
                    <div className="my-3">
                        <input
                            type="text"
                            className="rounded-md text-sm border border-zinc-300 px-2 w-[60px] mr-2"
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
                        <span className="text-sm">minutes</span>
                    </div>
                </div>
             </PopoverContent>
        </Popover>
    )
}

export default SettingPopover