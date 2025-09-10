'use client'
import { ethers} from 'ethers'
import SVGMinus from "@/lib/svgs/svg_minus";
import SVGPlus from "@/lib/svgs/svg_plus";
import SVGZoomIn from "@/lib/svgs/svg_zoom_in";
import SVGZoomOut from "@/lib/svgs/svg_zoom_out";
import type { TokenType } from "@/lib/types";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { 
    nearestUsableTick
    } from '@uniswap/v3-sdk'
import { MAX_TICK, MIN_TICK } from "@/config/constants";
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider";
import { Decimal } from 'decimal.js'
import { PoolRange, calcPoolPriceFromTick } from "@/lib/tools/pool";

const calPercentage = (price: string, marketPrice: string) => {
    const percentage = new Decimal(price).minus(new Decimal(marketPrice)).div(new Decimal(marketPrice)).mul(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toString()
    return percentage
}

const Axis = () => {
    return <div className="w-[300px] bg-zinc-400 h-[4px] absolute top-0"></div>
}

type PriceSelectorProps = {
    min: number;
    max: number;
    lower: number;
    upper: number;
    cur: number;
    poolRange: PoolRange;
    marketPrice: string;
    tickSpacing: number;
    token0: TokenType;
    token1: TokenType
    updateMinMax: (min: number, max: number) => void;
    updateTicks: (lower: number, cur: number, upper: number) => void
}
const PriceSelector: React.FC<PriceSelectorProps> = ({min, max, lower, upper, cur, marketPrice, tickSpacing, 
                                                        token0, token1, 
                                                        updateMinMax, updateTicks}) => {
    const [initState, setInitState] = useState({
                                            min: min, 
                                            max: max, 
                                            lowerVal: lower,
                                            upperVal: upper
                                        })
    const [state, setState] = useState<{min: number, max: number, currentTick: number, lower: number, upper: number}>({min: min, max: max, currentTick: cur, lower: lower, upper: upper})          
    //const [lowerVal, setLowerVal] = useState<number>(lower)
    //const [upperVal, setUpperVal] = useState<number>(upper)
    //const [currentTick, setCurrentTick] = useState(cur) 

    const lowerValInputRef = useRef<HTMLInputElement>(null)
    const upperValInputRef = useRef<HTMLInputElement>(null)
    const range = useRef<HTMLDivElement>(null);
    const lowerValLabelRef = useRef<HTMLDivElement>(null)
    const upperValLabelRef = useRef<HTMLDivElement>(null)
    const setCurrentPriceRef = useRef<HTMLInputElement>(null)
    const setCurrentPriceLabelRef = useRef<HTMLInputElement>(null)
   
    //console.log('lowerVal=', lowerVal, 'upperVal=', upperVal)
    console.log('min=', min, 'max=', max)
    //console.log('currentTick=', currentTick)
    console.log('initState=', initState)

    const getPercent = useCallback(
        (value: number) => Math.max(Math.round(((value - min) / (max - min)) * 100), 0),
        [min, max]
      );

    useEffect(() => {
        updateTicks(state.lower, state.currentTick, state.upper)
    }, [state.lower, state.currentTick, state.upper])

    useEffect(() => {
        if (setCurrentPriceRef.current) {
            const percent = getPercent(state.currentTick)
            setCurrentPriceRef.current.style.left = `0%`;
            setCurrentPriceRef.current.style.width = `${percent}%`
            if (setCurrentPriceLabelRef.current) {
                setCurrentPriceLabelRef.current.style.left = `${percent}%`
            }
        }
    }, [state.currentTick, min, max])
    
    useEffect(() => {
        if (upperValInputRef.current) {
            const minPercent = getPercent(state.lower);
            const maxPercent = getPercent(Number(upperValInputRef.current.value));

            if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
            
            }
            if (lowerValLabelRef.current) {
                lowerValLabelRef.current.style.left = `${minPercent}%`;
            }
        }
    }, [state.lower, getPercent]);

    useEffect(() => {
        if (lowerValInputRef.current) {
            const lowerPercent = getPercent(Number(lowerValInputRef.current.value));
            const upperPercent = getPercent(state.upper);

            if (range.current) {
                range.current.style.left = `${lowerPercent}%`;
                range.current.style.width = `${upperPercent - lowerPercent}%`;
            }
            if (upperValLabelRef.current) {
                upperValLabelRef.current.style.left = `${upperPercent}%`;
            }
        }
    }, [state.upper, getPercent]);

    const onChangeLeft = (e: React.ChangeEvent<HTMLInputElement>) => {
        // why using nearestUsableTick?
        // make sure that the value is a valid usableTick
        const newLower = Math.min(nearestUsableTick(Number(e.target.value), tickSpacing), state.upper); 
        setState({...state, lower: newLower});
        
    }
    const onChangeRight = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUpper = Math.max(nearestUsableTick(Number(e.target.value), tickSpacing), state.lower);
        setState({...state, upper: newUpper})
        
    }

    const handleReset = () => {
        updateMinMax(initState.min, initState.max)
        setState({...state, lower: initState.lowerVal, upper: initState.upperVal})
    }

    const handleZoomIn = () => {
        const newMin = Math.min(state.lower, min + tickSpacing)
        const newMax = Math.max(state.upper, max - tickSpacing)
        updateMinMax(newMin, newMax)
    }
    const handleZoomOut = () => {
        const newMin = Math.max(min - tickSpacing, Math.ceil(MIN_TICK / tickSpacing) * tickSpacing)
        const newMax = Math.min(max + tickSpacing, Math.floor(MAX_TICK / tickSpacing) * tickSpacing)
        updateMinMax(newMin, newMax)
    }

    const plusLower = () => {
        const newLower = Math.min(state.lower + tickSpacing, state.upper)
        setState({...state, lower: newLower});
    }

    const minusLower = () => {
        const newLower = Math.max(state.lower - tickSpacing, min)
        setState({...state, lower: newLower});
    }
    
    const plusUpper = () => {
        const newUpper = Math.min(max, state.upper + tickSpacing)
        setState({...state, upper: newUpper})
    }
    
    const minusUpper = () => {
        const newUpper = Math.max(state.lower, state.upper - tickSpacing)
        setState({...state, upper: newUpper})
    }

    return (
        <div>
            <div className="flex justify-center">
                <div className="w-[300px] h-[200px] flex justify-center items-center flex-col relative text-xs">
                    <div className="w-[300px] h-[200px] bg-zinc-600/30 absolute bottom-0"></div> 
                    <div ref={setCurrentPriceRef} className="border-dashed border-r-[1px] border-white h-[200px] box-border absolute bottom-0"></div>
                    <div className="absolute bottom-0">
                        <div className="w-[300px] h-0 relative bg-zinc-900">
                            <Axis/>
                            <div ref={range} className="bg-pink-600/30 h-[200px] absolute bottom-0 group" >
                                <div className="text-white w-fit px-2 py-1 absolute top-20 left-[-50px]">{`${calPercentage(calcPoolPriceFromTick(state.lower, token0, token1), marketPrice)}%`}</div>
                                <div className="text-white w-fit px-2 py-1 absolute top-20 right-[-50px]">{`${calPercentage(calcPoolPriceFromTick(state.upper, token0, token1), marketPrice)}%`}</div>
                            </div>
                            <input 
                                className="thumbbar w-[300px] z-10" 
                                type="range" 
                                min={min}
                                max={max}
                                value={state.lower}
                                ref={lowerValInputRef}
                                onChange={onChangeLeft}
                                /> 
                            <input 
                                className="thumbbar w-[300px] z-20" 
                                type="range" 
                                min={min}
                                max={max}
                                value={state.upper}
                                ref={upperValInputRef}
                                onChange={onChangeRight}
                                /> 
                            <div ref={setCurrentPriceLabelRef} className="text-white absolute bottom-[-10px]">
                                <div className="absolute left-0 -translate-x-1/2">{calcPoolPriceFromTick(state.currentTick, token0, token1)}</div>  
                            </div>
                            <div ref={lowerValLabelRef} className="text-white absolute bottom-[20px]">
                                <div className="absolute left-0 -translate-x-1/2 bg-pink-600 border-[1px] border-zinc-200 rounded-full px-2 z-10">{calcPoolPriceFromTick(state.lower, token0, token1)}</div>  
                            </div>
                            <div ref={upperValLabelRef} className="text-white absolute bottom-[40px]">
                                <div className="absolute left-0 -translate-x-1/2 bg-pink-600 border-[1px] border-zinc-200 rounded-full px-2 z-20">{calcPoolPriceFromTick(state.upper, token0, token1)}</div> 
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-end items-center text-white">
                <div className=" pr-1 pl-2 py-1 rounded-l-full bg-zinc-400/30 hover:bg-zinc-200/30 active:bg-zinc-100/30">
                    <SVGZoomOut className="size-5 cursor-pointer" onClick={handleZoomOut}/>
                </div>
                <div className=" pl-1 pr-2 py-1 rounded-r-full bg-zinc-400/30 hover:bg-zinc-200/30 active:bg-zinc-100/30">
                    <SVGZoomIn className="size-5 cursor-pointer" onClick={handleZoomIn}/>

                </div>
                <div className="h-7 text-xs px-2 py-1 bg-zinc-400/30 hover:bg-zinc-200/30 active:bg-zinc-100/30 rounded-full w-fit text-white cursor-pointer flex items-center ml-2"
                    onClick={handleReset}> <span>Reset</span></div>
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-1">
                <div className="border-[1px] border-zinc-700 rounded-none md:rounded-bl-md flex justify-between items-center p-4">
                    <div className="flex flex-col justify-between text-xs">
                        <div>Lower price</div>
                        <input type="text" className="w-28 bg-inherit text-base py-3" readOnly value={calcPoolPriceFromTick(state.lower, token0, token1)}/>
                        <div>{token0 && token1 ? <span>{`${token1?.symbol} = 1 ${token0?.symbol}`}</span> : <span></span>}</div>
                    </div>
                    <div>
                        <SVGMinus 
                            onClick={minusLower}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500"/>
                        <SVGPlus 
                            onClick={plusLower}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500 mt-2"/>
                    </div>
                </div>
                <div className="border-[1px] border-zinc-700 rounded-b-md md:rounded-br-md md:rounded-bl-none flex justify-between items-center p-4">
                    <div className="flex flex-col justify-between text-xs">
                        <div>Upper price</div>
                        <input type="text" className="w-28 bg-inherit text-base py-3" readOnly value={calcPoolPriceFromTick(state.upper, token0, token1)} />
                        <div>{token0 && token1 ? <span>{`${token1?.symbol} = 1 ${token0?.symbol}`}</span> : <span></span>}</div>
                    </div>
                    <div>
                        <SVGMinus 
                            onClick={minusUpper}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500"/>
                        <SVGPlus 
                            onClick={plusUpper}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500 mt-2"/>
                    </div>
                </div>
            </div>
        </div>    
    )
}

export default memo(PriceSelector)

// for a good understanding for the price selector, pls check the original codes
// at : https://github.com/JanessaTech/exercises/blob/master/nextjs/next-toolkits/src/app/slider/range3/PriceSelector.tsx