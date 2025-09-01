import type { TokenType } from "@/lib/types";
import Token from "../common/Token";
import { useState } from "react";

type DepositProps = {
    token0: TokenType;
    token1: TokenType;
    amount0: string,
    amount1: string;
    depositVisible: {token0: boolean, token1: boolean};
    handleDepositToken0Change: (value: string) => void;
    handleDepositToken1Change: (value: string) => void;
}
const Deposit: React.FC<DepositProps> = ({amount0, amount1, token0, token1, depositVisible,
    handleDepositToken0Change, handleDepositToken1Change}) => {

    return (
        <div className="py-5">
            <div className="pb-2">Deposit tokens</div>
            {
                depositVisible.token0 &&
                <div className="w-full rounded-md p-4 bg-pink-600/10 flex justify-between items-center my-2">
                    <div className="grow basis-10">
                        <input 
                            type="text" 
                            className="bg-inherit text-xl text-pink-600 w-full pr-3 box-border"
                            value={amount0}
                            onChange={(e) => handleDepositToken0Change(e.target.value)}
                            onKeyDown={(event) => {
                                const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                                            || (amount0 === '' && event?.key >= '0' && event?.key <= '9')
                                            || (amount0 === '0' && event?.key === '.')
                                            || (/^[1-9]\d{0,20}$/.test(amount0) && event?.key >= '0' && event?.key <= '9')
                                            || (/^[1-9]\d{0,20}$/.test(amount0) && event?.key === '.')
                                            || (/^[1-9]\d{0,20}.\d{0,20}$/.test(amount0) && event?.key >= '0' && event?.key <= '9')
                                            || (/^0.\d{0,20}$/.test(amount0) && event?.key >= '0' && event?.key <= '9')
                                if (!allow) {
                                    event.preventDefault(); 
                                }
                            }}
                        />
                        <div className="text-xs text-zinc-400">$0</div>
                    </div>
                    <Token token={token0} imageSize={30}/>
                </div>
            }
            {
                depositVisible.token1 &&
                <div className="w-full rounded-md p-4 bg-pink-600/10 flex justify-between items-center">
                    <div className="grow basis-10">
                        <input 
                            type="text" 
                            className="bg-inherit text-xl text-pink-600 w-full pr-3 box-border"
                            value={amount1}
                            onChange={(e) => handleDepositToken1Change(e.target.value)}
                            onKeyDown={(event) => {
                                const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                                            || (amount1 === '' && event?.key >= '0' && event?.key <= '9')
                                            || (amount1 === '0' && event?.key === '.')
                                            || (/^[1-9]\d{0,20}$/.test(amount1) && event?.key >= '0' && event?.key <= '9')
                                            || (/^[1-9]\d{0,20}$/.test(amount1) && event?.key === '.')
                                            || (/^[1-9]\d{0,20}.\d{0,20}$/.test(amount1) && event?.key >= '0' && event?.key <= '9')
                                            || (/^0.\d{0,20}$/.test(amount1) && event?.key >= '0' && event?.key <= '9')
                                if (!allow) {
                                    event.preventDefault(); 
                                }
                            }}
                        />
                        <div className="text-xs text-zinc-400">$0</div>
                    </div>
                    <Token token={token1} imageSize={30}/>
                </div>
            }
        </div>
    )
}

export default Deposit