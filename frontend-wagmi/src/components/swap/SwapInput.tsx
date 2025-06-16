type SwapInputProps = {
    hidden: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SwapInput: React.FC<SwapInputProps> = ({hidden, onChange}) => {
    return (
        <input className={`border-zinc-700 border-[1px] rounded-r-md w-3/5
            box-border bg-zinc-900 px-3 focus:border-pink-600
            ${hidden ? 'hidden' : ''}`} 
            
            onChange={onChange}></input>
    )
}

export default SwapInput