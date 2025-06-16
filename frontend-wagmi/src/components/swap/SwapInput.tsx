import { useState } from "react";

type SwapInputProps = {
    hidden: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SwapInput: React.FC<SwapInputProps> = ({hidden, onChange}) => {
    const [input, setInput] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }
    return (
        <div className={`relative w-3/5 h-full box-border bg-zinc-900 border-zinc-700 border-[1px] rounded-r-md focus:border-pink-600 ${hidden ? 'hidden' : ''}`}>
            <input className={`bg-inherit px-3 box-border ${String(input).length > 10 ? 'mt-2 w-full' : 'mt-2 md:mt-5 w-full md:w-36'}`} 
            onChange={handleInputChange}></input>
            <div className={`absolute text-zinc-400 left-2 top-9 text-xs w-24 md:w-28 truncate ${String(input).length > 10 ? '' : 'md:left-32 md:top-6 '} ${String(input).length > 0 ? '' : 'hidden'}`}>
                <span>=$56894442346664</span>
            </div>
        </div>
    )
}

export default SwapInput