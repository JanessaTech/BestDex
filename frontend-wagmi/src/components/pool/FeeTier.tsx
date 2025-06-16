import SVGCheck from "@/lib/svgs/svg_check"
import { useState } from "react"

type FeeTierProps = {}
const FeeTier: React.FC<FeeTierProps> = () => {
    const [select, setSelect] = useState(2)
    
    return (
        <div className='py-5'>
                        <div className='pb-2'>Fee tier</div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                            <div className='border-[1px] rounded-md border-zinc-700 p-3 cursor-pointer hover:bg-pink-600/15' onClick={() => setSelect(0)}>
                                <div className='flex justify-between items-center'>
                                    <span className={`text-sm font-semibold ${select === 0 ? 'text-pink-600' : 'text-white'}`}>0.01%</span>
                                    <SVGCheck className={`text-white bg-pink-600 rounded-full p-1 size-5 ${select === 0 ? '' : 'invisible'}`}/>
                                </div>
                                <div className='text-xs pt-2'><span>Best for very stable pairs.</span></div>
                            </div>
                            <div className='border-[1px] rounded-md border-zinc-700 p-3 cursor-pointer hover:bg-pink-600/15' onClick={() => setSelect(1)}>
                                <div className='flex justify-between items-center'>
                                    <span className={`text-sm font-semibold ${select === 1 ? 'text-pink-600' : 'text-white'}`}>0.05%</span>
                                    <SVGCheck className={`text-white bg-pink-600 rounded-full p-1 size-5 ${select === 1 ? '' : 'invisible'}`}/>
                                </div>
                                <div className='text-xs pt-2'><span>Best for stable pairs.</span></div>
                            </div>
                            <div className='border-[1px] rounded-md border-zinc-700 p-3 cursor-pointer hover:bg-pink-600/15' onClick={() => setSelect(2)}>
                                <div className='flex justify-between items-center'>
                                    <span className={`text-sm font-semibold ${select === 2 ? 'text-pink-600' : 'text-white'}`}>0.3%</span>
                                    <SVGCheck className={`text-white bg-pink-600 rounded-full p-1 size-5 ${select === 2 ? '' : 'invisible'}`}/>
                                </div>
                                <div className='text-xs pt-2'><span>Best for most pairs.</span></div>
                            </div>
                            <div className='border-[1px] rounded-md border-zinc-700 p-3 cursor-pointer hover:bg-pink-600/15' onClick={() => setSelect(3)}>
                                <div className='flex justify-between items-center'>
                                    <span className={`text-sm font-semibold ${select === 3 ? 'text-pink-600' : 'text-white'}`}>1%</span>
                                    <SVGCheck className={`text-white bg-pink-600 rounded-full p-1 size-5 ${select === 3 ? '' : 'invisible'}`}/>
                                </div>
                                <div className='text-xs pt-2'><span>Best for exotic pairs.</span></div>
                            </div>
                        </div>
        </div>
    )
}

export default FeeTier