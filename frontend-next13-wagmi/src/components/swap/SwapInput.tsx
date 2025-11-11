import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useChainId} from 'wagmi'
import { ChainId } from '@uniswap/sdk-core'
import { Decimal } from 'decimal.js';
import { useEffect, useState } from "react";
import { LocalChainIds, TokenType } from "@/common/types";

type SwapInputProps = {
    tokenFrom: TokenType | undefined;
    amount: string;
    hidden: boolean;
    onChange: (value: string) => void
}
const SwapInput: React.FC<SwapInputProps> = ({tokenFrom, amount, hidden, onChange}) => {
    const [usd, setUsd] = useState('')
    const {tokenPrices} = useContextUtil() as IContextUtil
    const chainId = useChainId() as (ChainId | LocalChainIds)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    useEffect(() => {
        if (tokenFrom && tokenFrom?.address && amount) {
            const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId  // for test
            const price = tokenPrices[targetChainId]?.get(tokenFrom?.address)
            const estimatedUSD = new Decimal(price ? price : '0').times(new Decimal(amount)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()
            setUsd(estimatedUSD)
        } else {
            setUsd('')
        }
    }, [tokenFrom, amount])

    return (
        <div className={`relative w-3/5 h-full box-border bg-zinc-900 border-zinc-700 border-[1px] rounded-r-md focus:border-pink-600 ${hidden ? 'hidden' : ''}`}>
            <input className={`bg-inherit px-3 box-border ${String(amount).length > 10 ? 'mt-2 w-full' : 'mt-2 md:mt-5 w-full md:w-36'}`} 
            value={amount}
            onChange={handleInputChange}
            onKeyDown={(event) => {
                const regex1 = new RegExp(`^[1-9]\\d{0,14}\\.\\d{0,${tokenFrom ? tokenFrom.decimal - 1 : '17'}}$`);
                const regex2 = new RegExp(`^0\\.\\d{0,${tokenFrom ? tokenFrom.decimal - 1 : '17'}}$`);
                const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                            || (amount === '' && event?.key >= '0' && event?.key <= '9')
                            || (amount === '0' && event?.key === '.')
                            || (/^[1-9]\d{0,13}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                            || (/^[1-9]\d{0,14}$/.test(amount) && event?.key === '.')
                            || (regex1.test(amount) && event?.key >= '0' && event?.key <= '9') //(/^[1-9]\d{0,14}\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                            || (regex2.test(amount) && event?.key >= '0' && event?.key <= '9')  //(/^0\.\d{0,17}$/.test(amount) && event?.key >= '0' && event?.key <= '9')
                if (!allow) {
                    event.preventDefault(); 
                }
            }}
            />
            <div className={`absolute text-zinc-400 left-2 top-9 text-xs w-24 md:w-28 truncate ${String(amount).length > 10 ? '' : 'md:left-32 md:top-6 '} ${String(amount).length > 0 ? '' : 'hidden'}`}>
                <span>{usd ? `≈$${usd}` : ''}</span>
            </div>
        </div>
    )
}

export default SwapInput