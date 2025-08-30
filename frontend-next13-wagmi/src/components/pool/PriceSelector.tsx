'use client'
import SVGMinus from "@/lib/svgs/svg_minus";
import SVGPlus from "@/lib/svgs/svg_plus";
import SVGZoomIn from "@/lib/svgs/svg_zoom_in";
import SVGZoomOut from "@/lib/svgs/svg_zoom_out";
import type { TokenType } from "@/lib/types";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { 
    nearestUsableTick
    } from '@uniswap/v3-sdk'

const Axis = () => {
    return <div className="w-[300px] bg-zinc-400 h-[4px] absolute top-0"></div>
}

type PriceSelectorProps = {
    min: number;
    max: number;
    lower: number;
    upper: number;
    cur: number;
    tickSpacing: number;
    token0: TokenType | undefined;
    token1: TokenType | undefined
    updateMinMax: (min: number, max: number) => void;
}
const PriceSelector: React.FC<PriceSelectorProps> = ({min, max, lower, upper, cur, tickSpacing, token0, token1, updateMinMax}) => {
    const [initState, setInitState] = useState({
                                            min: min, 
                                            max: max, 
                                            lowerVal: lower,
                                            upperVal: upper
                                        })
    const [lowerVal, setLowerVal] = useState<number>(lower)
    const [upperVal, setMaxVal] = useState<number>(upper)
    const lowerValInputRef = useRef<HTMLInputElement>(null)
    const upperValInputRef = useRef<HTMLInputElement>(null)
    const range = useRef<HTMLDivElement>(null);
    const lowerValLabelRef = useRef<HTMLDivElement>(null)
    const upperValLabelRef = useRef<HTMLDivElement>(null)
    const [mid, setMid] = useState(cur) 
    const midRef = useRef<HTMLInputElement>(null)
    const midValueDivRef = useRef<HTMLInputElement>(null)

    console.log('lowerVal=', lowerVal, 'upperVal=', upperVal)
    console.log('min=', min, 'max=', max)
    console.log('mid=', mid)
    console.log('initState=', initState)

    const getPercent = useCallback(
        (value: number) => Math.max(Math.round(((value - min) / (max - min)) * 100), 0),
        [min, max]
      );

    useEffect(() => {
        if (midRef.current) {
            const percent = getPercent(mid)
            midRef.current.style.left = `0%`;
            midRef.current.style.width = `${percent}%`
            //console.log('mid', mid)
            //console.log('mid percent', percent)
            if (midValueDivRef.current) {
                midValueDivRef.current.style.left = `${percent}%`
            }
        }
    }, [mid])
    
    useEffect(() => {
        if (upperValInputRef.current) {
            const minPercent = getPercent(lowerVal);
            const maxPercent = getPercent(Number(upperValInputRef.current.value));

            if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
            
            }
            if (lowerValLabelRef.current) {
                lowerValLabelRef.current.style.left = `${minPercent}%`;
            }
        }
    }, [lowerVal, getPercent]);

    useEffect(() => {
        if (lowerValInputRef.current) {
            const minPercent = getPercent(Number(lowerValInputRef.current.value));
            const maxPercent = getPercent(upperVal);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
            if (upperValLabelRef.current) {
                upperValLabelRef.current.style.left = `${maxPercent}%`;
            }
        }
    }, [upperVal, getPercent]);

    const onChangeLeft = (e: React.ChangeEvent<HTMLInputElement>) => {
        // why using nearestUsableTick?
        // make sure that the value is a valid usableTick
        const value = Math.min(nearestUsableTick(Number(e.target.value), tickSpacing), upperVal); 
        setLowerVal(value);
    }
    const onChangeRight = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(nearestUsableTick(Number(e.target.value), tickSpacing), lowerVal);
        setMaxVal(value)
    }

    const handleReset = () => {
        updateMinMax(initState.min, initState.max)
        setLowerVal(initState.lowerVal)
        setMaxVal(initState.upperVal)
    }

    const handleZoomIn = () => {
        const newMin = Math.min(parseFloat(((19 * min + max) / 20).toFixed(2)), lowerVal)
        const newMax = Math.max(parseFloat(((19 * max + min) / 20).toFixed(2)), upperVal)
        updateMinMax(newMin, newMax)
    }
    const handleZoomOut = () => {
        const newMin = parseFloat(((21 * min - max) / 20).toFixed(2))
        const newMax = parseFloat(((21 * max - min) / 20).toFixed(2))
        updateMinMax(newMin, newMax)
    }

    const plusLower = () => {
        const newMinVal = parseFloat((lowerVal + (mid - lowerVal) / 10).toFixed(2))
        setLowerVal(newMinVal);
    }

    const minusLower = () => {
        const newMinVal = Math.max(min, parseFloat((lowerVal - (mid - lowerVal) / 10).toFixed(2)))
        setLowerVal(newMinVal);
    }
    
    const plusUpper = () => {
        const newMaxVal = Math.min(max, parseFloat((upperVal + (upperVal - mid) /10).toFixed(2)))
        setMaxVal(newMaxVal)
    }
    
    const minusUpper = () => {
        const newMaxVal = parseFloat((upperVal - (upperVal - mid) /10).toFixed(2))
        setMaxVal(newMaxVal)
    }

    return (
        <div>
            <div className="flex justify-center">
                <div className="w-[300px] h-[200px] flex justify-center items-center flex-col relative text-xs">
                    <div className="w-[300px] h-[200px] bg-zinc-600/30 absolute bottom-0"></div> 
                    <div ref={midRef} className="border-dashed border-r-[1px] border-white h-[200px] box-border absolute bottom-0"></div>
                    <div className="absolute bottom-0">
                        <div className="w-[300px] h-0 relative bg-zinc-900">
                            <Axis/>
                            <div ref={range} className="bg-pink-600/30 h-[200px] absolute bottom-0 group" >
                                <div className="text-white w-fit px-2 py-1 absolute top-20 left-[-50px]">10%</div>
                                <div className="text-white w-fit px-2 py-1 absolute top-20 right-[-50px]">10%</div>
                            </div>
                            <input 
                                className="thumbbar w-[300px] z-10" 
                                type="range" 
                                min={min}
                                max={max}
                                value={lowerVal}
                                ref={lowerValInputRef}
                                onChange={onChangeLeft}
                                /> 
                            <input 
                                className="thumbbar w-[300px] z-20" 
                                type="range" 
                                min={min}
                                max={max}
                                value={upperVal}
                                ref={upperValInputRef}
                                onChange={onChangeRight}
                                /> 
                            <div ref={midValueDivRef} className="text-white absolute bottom-[-25px]">{mid}</div>
                            <div ref={lowerValLabelRef} className="text-white absolute bottom-[-25px]">{lowerVal}</div>
                            <div ref={upperValLabelRef} className="text-white absolute bottom-[-25px]">{upperVal}</div> 
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
                        <input type="text" className="w-28 bg-inherit text-base py-3" readOnly value={lowerVal}/>
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
                        <input type="text" className="w-28 bg-inherit text-base py-3" readOnly value={upperVal}/>
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