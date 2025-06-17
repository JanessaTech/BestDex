import type { TokenType } from "@/lib/types";
import Image from "next/image";
import Token from "../common/Token";

type DepositProps = {
    token1: TokenType | undefined;
    token2: TokenType | undefined;
    amount1: string,
    amount2: string;
    handleDepositToken1Change: (value: string) => void;
    handleDepositToken2Change: (value: string) => void;
}
const Deposit: React.FC<DepositProps> = ({amount1, amount2, token1, token2, handleDepositToken1Change, handleDepositToken2Change}) => {
    return (
        <div className="py-5">
            <div className="pb-2">Deposit tokens</div>
            <div className="w-full rounded-md p-4 bg-pink-600/10 flex justify-between items-center my-2">
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
            <div className="w-full rounded-md p-4 bg-pink-600/10 flex justify-between items-center">
                <div className="grow basis-10">
                    <input 
                        type="text" 
                        className="bg-inherit text-xl text-pink-600 w-full pr-3 box-border"
                        value={amount2}
                        onChange={(e) => handleDepositToken2Change(e.target.value)}
                        onKeyDown={(event) => {
                            const allow =  (event?.key === 'Backspace' || event?.key === 'Delete')
                                        || (amount2 === '' && event?.key >= '0' && event?.key <= '9')
                                        || (amount2 === '0' && event?.key === '.')
                                        || (/^[1-9]\d{0,20}$/.test(amount2) && event?.key >= '0' && event?.key <= '9')
                                        || (/^[1-9]\d{0,20}$/.test(amount2) && event?.key === '.')
                                        || (/^[1-9]\d{0,20}.\d{0,20}$/.test(amount2) && event?.key >= '0' && event?.key <= '9')
                                        || (/^0.\d{0,20}$/.test(amount2) && event?.key >= '0' && event?.key <= '9')
                            if (!allow) {
                                event.preventDefault(); 
                            }
                        }}
                    />
                    <div className="text-xs text-zinc-400">$0</div>
                </div>
                <Token token={token2} imageSize={30}/>
            </div>
        </div>
    )
}

export default Deposit