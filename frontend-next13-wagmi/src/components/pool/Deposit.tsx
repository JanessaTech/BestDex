import type { TokenType } from "@/lib/types";
import { 
    FeeAmount,
    Position,
    Pool} from '@uniswap/v3-sdk';
import {Token} from '@uniswap/sdk-core';
import { fromReadableAmount2 } from "@/lib/utils";
import { Decimal } from 'decimal.js';
import { useEffect, useState } from "react";
import { useAccount} from 'wagmi'
import { PoolInfo } from "@/lib/tools/pool";
import { Button } from '../ui/button';
import ReviewAddPosition from "./ReviewAddPosition";
import DepositInput from "./DepositInput";

type DepositProps = {
    token0: TokenType;
    token1: TokenType;
    amount0: string,
    amount1: string;
    poolInfo: PoolInfo; 
    lowerTick: number;
    curTick: number;
    upperTick: number;
    openAddPositionModal: boolean;
    closeAddPositionModal: () => void;
    checkRefresh: () => Promise<void>;
    handleDepositChanges: (amount0 : string, amount1: string) => void
}
const Deposit: React.FC<DepositProps> = ({amount0, amount1, token0, token1, 
                                        poolInfo, lowerTick, curTick, upperTick,
                                        openAddPositionModal,
                                        closeAddPositionModal,checkRefresh,
                                        handleDepositChanges}) => {
    const {address} = useAccount()
    const [whoInput, setWhoInput] = useState(0) // indicate which token is as the major input: 0 for token0, 1 for token1
    const [tokenBalances, setTokenBalances] = useState<{token0: string, token1: string}>({token0: '999999999999999999999', token1: '999999999999999999'})

    useEffect(() => {
        // (async () => {
        //     let balance0 = '0', balance1 = '0'
        //     if (address) {
        //         try {
        //             if (token0) {
        //                 balance0 = await getTokenBalance(token0.address, address!, {decimals: token0.decimal})
        //             }
        //             if (token1) {
        //                 balance1 = await getTokenBalance(token1.address, address!, {decimals: token1.decimal})
        //             }
        //             setTokenBalances({token0: balance0, token1: balance1})
        //         } catch (error) {
        //             console.log(error)
        //         }
        //     }
        // })()
    }, [address])

    useEffect(() => {
        console.log('[Deposit] lowerTick=', lowerTick, 'curTick=', curTick, 'upperTick=', upperTick)
        if (!poolInfo) return
        if (upperTick <= curTick) {
            console.log('token0 is hidden')
            handleDepositChanges('0', '0')
        } else if (lowerTick >= curTick) {
            console.log('token1 is hidden')
            handleDepositChanges('0', '0')
        } else {
            console.log('no tokens is hidden')
            if (whoInput === 0 && amount0) {
                const position = createPoistionFromToken0(amount0)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                handleDepositChanges(amount0, burnAmount1)
            } else if (whoInput === 1 && amount1) {
                const position = createPoistionFromToken1(amount1)
                const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
                const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()
        
                console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
                handleDepositChanges(burnAmount0, amount1)
            }
        }
    }, [lowerTick, curTick, upperTick])

    const createPoistionFromToken0 = (value: string) => {
        const feeAmount_enum = poolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            poolInfo.sqrtPriceX96,
            poolInfo.liquidity,
            poolInfo.tick
        )
        const position = Position.fromAmount0({
            pool: configuredPool,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amount0: fromReadableAmount2(value, token0.decimal),
            useFullPrecision: true,
        })

        return position
    }

    const createPoistionFromToken1 = (value: string) => {
        const feeAmount_enum = poolInfo.fee as FeeAmount
        const configuredPool = new Pool(
            new Token(token0.chainId, token0.address, token0.decimal, token0.symbol, token0.name),
            new Token(token1.chainId, token1.address, token1.decimal, token1.symbol, token1.name),
            feeAmount_enum,
            poolInfo.sqrtPriceX96,
            poolInfo.liquidity,
            poolInfo.tick
        )
        const position = Position.fromAmount1({
            pool: configuredPool,
            tickLower: lowerTick,
            tickUpper: upperTick,
            amount1: fromReadableAmount2(value, token1.decimal)
        })

        return position
    }

    const updateToken0Change = (value: string) => {
        if (!poolInfo) return
        const position = createPoistionFromToken0(value)
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        console.log('value=', value)
        handleDepositChanges(value, burnAmount1)
        setWhoInput(0)
    }

    const updateToken1Change = (value: string) => {
        if (!poolInfo) return
        const position = createPoistionFromToken1(value)
        const burnAmount0 = new Decimal(position.amount0.quotient.toString()).dividedBy(new Decimal(10).pow(token0.decimal)).toDecimalPlaces(token0.decimal, Decimal.ROUND_HALF_UP).toString()
        const burnAmount1 = new Decimal(position.amount1.quotient.toString()).dividedBy(new Decimal(10).pow(token1.decimal)).toDecimalPlaces(token1.decimal, Decimal.ROUND_HALF_UP).toString()

        console.log('burnAmount0=', burnAmount0, '   burnAmount1=', burnAmount1)
        handleDepositChanges(burnAmount0, value)
        setWhoInput(1)
    }

    const checkDisabled = () => {
        let disabled = true
        const dec0 = new Decimal(amount0 ? amount0 : '0')
        const dec1 = new Decimal(amount1 ? amount1 : '0')
        if (upperTick <= curTick) { // token0 is hidden
            //we check token1 only
            disabled = dec1.lessThanOrEqualTo(new Decimal(tokenBalances.token1)) && dec1.greaterThan(0) ? false : true
        } else if (lowerTick >= curTick) { // token1 is hidden
            //we check token0 only
            disabled = dec0.lessThanOrEqualTo(new Decimal(tokenBalances.token0)) && dec0.greaterThan(0) ? false : true
        } else { // no tokens hidden
            // we check both of tokens
            disabled = dec0.lessThanOrEqualTo(new Decimal(tokenBalances.token0)) && dec0.greaterThan(0) && dec1.lessThanOrEqualTo(new Decimal(tokenBalances.token1)) && dec1.greaterThan(0)? false : true
        }
        return disabled
    }

    return (
        <div>
            <div className="py-5">
                <div className="pb-2">Deposit tokens</div>
                {
                    upperTick > curTick && <DepositInput 
                                            amount={amount0} token={token0} tokenBalance={tokenBalances.token0}
                                            updateTokenChange={updateToken0Change}/>
                }
                {
                    lowerTick < curTick && <DepositInput 
                                            amount={amount1} token={token1} tokenBalance={tokenBalances.token1}
                                            updateTokenChange={updateToken1Change}/>
                }
            </div>
            <div className='pt-4'>
                <Button 
                    className='w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-600'
                    disabled={checkDisabled()}
                    onClick={checkRefresh}
                    > 
                    <span>Add position</span>
                </Button>
            </div>
            {
                openAddPositionModal && <ReviewAddPosition 
                                    token0={token0}
                                    token1={token1}
                                    token0Input={amount0}
                                    token1Input={amount1}
                                    poolInfo={poolInfo}
                                    lowerTick={lowerTick}
                                    curTick={curTick}
                                    upperTick={upperTick}
                                    closeAddPositionModal={closeAddPositionModal}/>
            }
        </div>
        
    )
}

export default Deposit