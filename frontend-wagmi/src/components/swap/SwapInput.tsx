

type SwapInputProps = {
    amount: string;
    hidden: boolean;
    onChange: (value: string) => void
}
const SwapInput: React.FC<SwapInputProps> = ({amount, hidden, onChange}) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //setInput(e.target.value)
        onChange(e.target.value)
    }

    return (
        <div className={`relative w-3/5 h-full box-border bg-zinc-900 border-zinc-700 border-[1px] rounded-r-md focus:border-pink-600 ${hidden ? 'hidden' : ''}`}>
            <input className={`bg-inherit px-3 box-border ${String(amount).length > 10 ? 'mt-2 w-full' : 'mt-2 md:mt-5 w-full md:w-36'}`} 
            onChange={handleInputChange}
            onKeyDown={(event) => {
                const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                            || (amount === '' && event?.key >= '0' && event?.key <= '9')
                            || (amount === '0' && event?.key === '.')
                            || (/^[1-9]\d{0,20}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                            || (/^[1-9]\d{0,20}$/.test(amount) && event?.key === '.')
                            || (/^[1-9]\d{0,20}.\d{0,20}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                            || (/^0.\d{0,20}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                if (!allow) {
                    event.preventDefault(); 
                }
            }}
            />
            <div className={`absolute text-zinc-400 left-2 top-9 text-xs w-24 md:w-28 truncate ${String(amount).length > 10 ? '' : 'md:left-32 md:top-6 '} ${String(amount).length > 0 ? '' : 'hidden'}`}>
                <span>=$56894442346664</span>
            </div>
        </div>
    )
}

export default SwapInput