'use client'
import SVGMinus from "@/lib/svgs/svg_minus";
import SVGPlus from "@/lib/svgs/svg_plus";
import SVGZoomIn from "@/lib/svgs/svg_zoom_in";
import SVGZoomOut from "@/lib/svgs/svg_zoom_out";
import type { TokenType } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";

const Axis = () => {
    return <div className="w-[300px] bg-zinc-400 h-[4px] absolute top-0"></div>
}

type PriceSelectorProps = {
    min: number;
    max: number;
    token1: TokenType | undefined;
    token2: TokenType | undefined
    updateMinMax: (min: number, max: number) => void;
}
const PriceSelector: React.FC<PriceSelectorProps> = ({min, max, token1, token2, updateMinMax}) => {
    const [initState, setInitState] = useState({
                                            initMin: min, 
                                            initMax: max, 
                                            minVal: parseFloat(((3 * min + max) / 4).toFixed(2)),
                                            maxVal: parseFloat(((min + 3 * max) / 4).toFixed(2))
                                        })
    const [initMin, setInitMin] = useState(min)
    const [initMax, setInitMax] = useState(max)
    const [minVal, setMinVal] = useState<number>(parseFloat(((3 * min + max) / 4).toFixed(2)));
    const [maxVal, setMaxVal] = useState<number>(parseFloat(((min + 3 * max) / 4).toFixed(2)));
    const minValInputRef = useRef<HTMLInputElement>(null);
    const maxValInputRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);
    const minValueDivRef = useRef<HTMLDivElement>(null);
    const maxValueDivRef = useRef<HTMLDivElement>(null);
    const [mid, setMid] = useState(parseFloat(((min + max) / 2).toFixed(2))) 

    console.log('minVal=', minVal, 'maxVal=', maxVal)
    console.log('min=', min, 'max=', max)
    console.log('mid=', mid)
    console.log('initState=', initState)

    const getPercent = useCallback(
        (value: number) => Math.max(Math.round(((value - min) / (max - min)) * 100), 0),
        [min, max]
      );
    
    useEffect(() => {
        if (maxValInputRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(Number(maxValInputRef.current.value));

            if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
            
            }
            if (minValueDivRef.current) {
                minValueDivRef.current.style.left = `${minPercent}%`;
            }

            //console.log('minPercent=', minPercent)
            //console.log('maxPercent=', maxPercent)
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        if (minValInputRef.current) {
            const minPercent = getPercent(Number(minValInputRef.current.value));
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
            if (maxValueDivRef.current) {
                maxValueDivRef.current.style.left = `${maxPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    const onChangeLeft = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxVal - 1);
          setMinVal(value);
    }
    const onChangeRight = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minVal + 1);
        setMaxVal(value)
        setMaxVal
    }

    const handleReset = () => {
        updateMinMax(initState.initMin, initState.initMax)
        setMinVal(initState.minVal)
        setMaxVal(initState.maxVal)
    }

    const handleZoomIn = () => {
        const newMin = Math.min(parseFloat(((19 * min + max) / 20).toFixed(2)), minVal)
        const newMax = Math.max(parseFloat(((19 * max + min) / 20).toFixed(2)), maxVal)
        console.log('handleZoomIn:', 'min=', min, '  max=', max)
        console.log('handleZoomIn:', 'newMin=', newMin+ ',  newMax=', newMax)
        updateMinMax(newMin, newMax)
    }
    const handleZoomOut = () => {
        const newMin = parseFloat(((21 * min - max) / 20).toFixed(2))
        const newMax = parseFloat(((21 * max - min) / 20).toFixed(2))
        updateMinMax(newMin, newMax)
    }

    const plusMin = () => {
        const newMinVal = parseFloat((minVal + (mid - minVal) / 10).toFixed(2))
        setMinVal(newMinVal);
    }

    const minusMin = () => {
        const newMinVal = Math.max(min, parseFloat((minVal - (mid - minVal) / 10).toFixed(2)))
        setMinVal(newMinVal);
    }
    
    const plusMax = () => {
        const newMaxVal = Math.min(max, parseFloat((maxVal + (maxVal - mid) /10).toFixed(2)))
        setMaxVal(newMaxVal)
    }
    
    const minusMax = () => {
        const newMaxVal = parseFloat((maxVal - (maxVal - mid) /10).toFixed(2))
        setMaxVal(newMaxVal)
    }

    return (
        <div>
            <div className="flex justify-center items-center flex-col relative text-xs">
                <div className="w-[300px] h-[200px] bg-zinc-600/30 absolute bottom-0"></div> 
                <div className="border-dashed border-[1px] border-white h-[200px] box-border"></div>
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
                        value={minVal}
                        ref={minValInputRef}
                        onChange={onChangeLeft}
                        /> 
                    <input 
                        className="thumbbar w-[300px] z-20" 
                        type="range" 
                        min={min}
                        max={max}
                        value={maxVal}
                        ref={maxValInputRef}
                        onChange={onChangeRight}
                        /> 
                    <div ref={minValueDivRef} className="text-white absolute bottom-[-25px]">{minVal}</div>
                    <div ref={maxValueDivRef} className="text-white absolute bottom-[-25px]">{maxVal}</div> 
                </div>
                <div className="h-0 relative">
                    <div className="py-1 text-white top-[5px] left-[-10px] absolute text-xs">{mid}</div>
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
                        <div>Min price</div>
                        <input type="text" className="w-28 bg-inherit text-base py-3" readOnly value={minVal}/>
                        <div>{token1 && token2 ? <span>{`${token2?.symbol} = 1 ${token1?.symbol}`}</span> : <span></span>}</div>
                    </div>
                    <div>
                        <SVGMinus 
                            onClick={minusMin}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500"/>
                        <SVGPlus 
                            onClick={plusMin}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500 mt-2"/>
                    </div>
                </div>
                <div className="border-[1px] border-zinc-700 rounded-b-md md:rounded-br-md md:rounded-bl-none flex justify-between items-center p-4">
                    <div className="flex flex-col justify-between text-xs">
                        <div>Max price</div>
                        <input type="text" className="w-28 bg-inherit text-base py-3" readOnly value={maxVal}/>
                        <div>{token1 && token2 ? <span>{`${token2?.symbol} = 1 ${token1?.symbol}`}</span> : <span></span>}</div>
                    </div>
                    <div>
                        <SVGMinus 
                            onClick={minusMax}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500"/>
                        <SVGPlus 
                            onClick={plusMax}
                            className="size-7 text-black bg-zinc-200 rounded-full cursor-pointer hover:bg-zinc-400 active:bg-zinc-500 mt-2"/>
                    </div>
                </div>
            </div>
        </div>    
    )
}

export default PriceSelector