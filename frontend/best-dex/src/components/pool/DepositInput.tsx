import type { TokenType } from "@/lib/types"

type DepositInputProps = {
    token?: TokenType | undefined
    tokenDepoist: number | '',
    onTokenDepositChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const DepositInput: React.FC<DepositInputProps> = ({token, tokenDepoist, onTokenDepositChange}) => {
    return (
        <div
            className="rounded-md h-16 w-full border border-zinc-300
            text-black text-lg px-3 bg-white relative mb-2">
                <input 
                    id='token0Deposit'
                    name='token0Deposit'
                    type="number"
                    className="w-[calc(100%-120px)] my-2"
                    value={tokenDepoist}
                    placeholder="0"
                    onChange={onTokenDepositChange}
                    onKeyDown={(event) => {
                        if (event?.key === '+' || event?.key === '-') {
                            event.preventDefault()
                        }
                    }}
                />
                <span className="text-zinc-400 text-sm absolute left-3 bottom-1">≈$332</span>
                <div className={`w-[110px] h-[40px] 
                    absolute right-3 top-[12px] rounded-full
                    flex items-center px-2
                    ${token ? 'bg-zinc-200' : 'bg-sky-500 text-sm text-white'}`}>
                        {
                            token ? 
                            <>
                                <img src={`/imgs/tokens/${token?.name}.png`} width={25} height={25} alt={token?.name}/>
                                <span className="font-semibold ml-2 text-sm">{token?.symbol}</span>
                            </> : <span className="mx-auto">Select token</span>
                        }
                </div>
        </div>
    )
}

export default DepositInput