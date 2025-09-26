import { TokenType, LocalChainIds} from "@/lib/types";
import { default as DexToken } from "../common/Token";
import { memo, useEffect, useState } from "react";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { useChainId } from "wagmi";
import { ChainId } from '@uniswap/sdk-core';
import { Decimal } from 'decimal.js';

type DepositInputProps = {
    amount: string;
    token: TokenType;
    tokenBalance: string;
    updateTokenChange: (value: string) => void
}
const DepositInput: React.FC<DepositInputProps> = ({amount, token, tokenBalance, updateTokenChange}) => {
    const [tokenUSD, setTokenUSD] = useState('0')

    const chainId = useChainId() as (ChainId | LocalChainIds)
    const {tokenPrices} = useContextUtil() as IContextUtil


    useEffect(() => {
        console.log('update usd')
        updateUSD()
    }, [amount])

    const updateUSD = () => {
        const targetChainId = chainId === 31337 ? ChainId.MAINNET : chainId   // for test
        const price = tokenPrices[targetChainId]?.get(token.address)
        let tokenUSD = '0'
        console.log('price=', price?.toString(), '  amount=', amount)
        if (price) {
            tokenUSD = new Decimal(price).times(amount ? new Decimal(amount) : 0).toDecimalPlaces(3, Decimal.ROUND_HALF_UP).toString()
        }
        
        setTokenUSD(tokenUSD)
    }

    return (
        <div className="w-full rounded-md p-4 bg-pink-600/10 flex justify-between items-center my-2">
                        <div className="grow basis-10">
                            <input 
                                type="text" 
                                className="bg-inherit text-xl text-pink-600 w-full pr-3 box-border"
                                value={amount}
                                onChange={(e) => updateTokenChange(e.target.value)}
                                onKeyDown={(event) => {
                                    const regex1 = new RegExp(`^[1-9]\\d{0,14}\\.\\d{0,${token.decimal - 1}}$`);
                                    const regex2 = new RegExp(`^0\\.\\d{0,${token.decimal - 1}}$`);
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
                            <div className="text-xs text-zinc-400">${tokenUSD}</div>
                        </div>
                        <div>
                            <DexToken token={token} imageSize={30}/>
                            <div className="text-xs text-zinc-400 mt-1">
                                <span>{tokenBalance}</span><span className="text-pink-600 ml-1">{token.symbol}</span>
                            </div>
                        </div> 
        </div>
    )
}

export default memo(DepositInput)