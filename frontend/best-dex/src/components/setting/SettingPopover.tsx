import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import CustomTooltip from "../common/CustomTooltip"
import { useState } from "react"
import { PopoverClose } from "@radix-ui/react-popover"
import Close from "@/lib/svgs/Close"


type SettingPopover = {
    open: boolean,
    onOpenChange: (open: boolean) => void
}

const SettingPopover: React.FC<SettingPopover> = ({open, onOpenChange}) => {
    const [custom, setCustom] = useState<string>('custom')
    const [selected, setSelected] = useState<number>(3)

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('e.target.value =', e.target.value)
        if (!e.target.value) {
            console.log("e.target.value === '' = ", e.target.value === '')
            console.log("e.target.value === undefined = ", e.target.value === undefined)
        }
        setCustom(e.target.value)
    }

    const handleOnBlur = () => {
        if (custom === '') {
            setCustom('custom')
            setSelected(3)
        }
    }

    const handleCustomClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (custom === 'custom') {
            setCustom('')
        }
        setSelected(4) 
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
             <PopoverTrigger>
                <img src="/imgs/setting.svg" alt="setting" className="ml-3 cursor-pointer"/>
             </PopoverTrigger>
             <PopoverContent align="end" className="w-[400px] py-4">
                <div className="flex justify-end">
                    <PopoverClose>
                        <Close className="text-zinc-500 hover:text-zinc-600 active:text-zinc-700 w-[20px] h-[20px]"/> 
                    </PopoverClose>
                </div>
                
                <div className="text-black">
                    <div className="mb-5">SWAP & LIQUIDITY</div>
                    <div className="flex">
                        <div className="font-semibold mr-2 text-sm">Slippage Tolerance</div>
                        <CustomTooltip>
                            <div>xxx</div>
                        </CustomTooltip>
                    </div>
                    <div className="flex justify-between my-3 items-center">
                        <div className={`rounded-full text-sm ${selected === 0 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(0)}>0.01%</div>
                        <div className={`rounded-full text-sm ${selected === 1 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(1)}>0.05%</div>
                        <div className={`rounded-full text-sm ${selected === 2 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(2)}>0.1%</div>
                        <div className={`rounded-full text-sm ${selected === 3 ? 'bg-sky-500' : 'hover:bg-zinc-100'}
                                        border border-zinc-300 px-2
                                        cursor-pointer`} onClick={() => setSelected(3)}>0.3%</div>
                        <div className="relative">
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
                                    onBlur={handleOnBlur}
                                    />
                            <span className="absolute text-sm right-[6px] top-[2px]">{custom === 'custom' ? '' : '%'}</span>
                        </div>
                    </div>
                    <div className="flex mt-5">
                        <div className="font-semibold mr-2 text-sm">Transaction Deadline</div>
                        <CustomTooltip>
                            <div>xxx</div>
                        </CustomTooltip>
                    </div>
                    <div className="my-3">
                        <input
                            type="number"
                            className="rounded-md text-sm border border-zinc-300 px-2 w-[200px] mr-2"
                            min={0}
                            max={100}
                            placeholder="0"
                             />
                        <span>minutes</span>
                    </div>
                </div>
             </PopoverContent>
        </Popover>
    )
}

export default SettingPopover