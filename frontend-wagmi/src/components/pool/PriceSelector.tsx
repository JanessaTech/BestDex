'use client'
import SVGZoomIn from "@/lib/svgs/svg_zoom_in";
import SVGZoomOut from "@/lib/svgs/svg_zoom_out";
import { useCallback, useEffect, useRef, useState } from "react";

const Axis = () => {
    return <div className="w-[300px] bg-zinc-400 h-[4px] absolute top-0"></div>
}

type PriceSelectorProps = {
    min: number;
    max: number;
    updateMinMax: (min: number, max: number) => void
}
const PriceSelector: React.FC<PriceSelectorProps> = ({min = 0, max = 1000, updateMinMax}) => {

    const [minVal, setMinVal] = useState<number>(parseFloat(((3 * min + max) / 4).toFixed(2)));
    const [maxVal, setMaxVal] = useState<number>(parseFloat(((min + 3 * max) / 4).toFixed(2)));
    const minValInputRef = useRef<HTMLInputElement>(null);
    const maxValInputRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);
    const minValueDivRef = useRef<HTMLDivElement>(null);
    const maxValueDivRef = useRef<HTMLDivElement>(null);
    const mid = parseFloat(((min + max) / 2).toFixed(2))

    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
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
        console.log('minPercent=', minPercent)
        console.log('maxPercent=', maxPercent)
    }
    }, [minVal, getPercent]);

    useEffect(() => {
    if (minValInputRef.current) {
        const minPercent = getPercent(Number(minValInputRef.current.value));
        const maxPercent = getPercent(maxVal);

        if (range.current) {
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
          e.target.value = value.toString();
    }
    const onChangeRight = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minVal + 1);
        setMaxVal(value);
        e.target.value = value.toString();
    }

    const handleReset = () => {
        setMinVal((3 * min + max) / 4)
        setMaxVal((min + 3 * max) / 4)
    }

    const handleZoomIn = () => {
        const newMin = parseFloat(((19 * min + max) / 20).toFixed(2))
        const newMax = parseFloat(((19 * max + min) / 20).toFixed(2))
        console.log('handleZoomIn:', 'min=', min, '  max=', max)
        console.log('handleZoomIn:', 'newMin=', newMin+ ',  newMax=', newMax)
        updateMinMax(newMin, newMax)
    }
    const handleZoomOut = () => {
        const newMin = Math.max(0, parseFloat(((21 * min - max) / 20).toFixed(2)))
        const newMax = parseFloat(((21 * max - min) / 20).toFixed(2))
        updateMinMax(newMin, newMax)
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
                <div>

                </div>
                <div className="h-7 text-xs px-2 py-1 bg-zinc-400/30 hover:bg-zinc-200/30 active:bg-zinc-100/30 rounded-full w-fit text-white cursor-pointer flex items-center ml-2"
                    onClick={handleReset}> <span>Reset</span></div>
            </div>
        </div>    
    )
}

export default PriceSelector