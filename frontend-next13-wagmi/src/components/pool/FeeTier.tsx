import SVGCheck from "@/lib/svgs/svg_check"
import { useState } from "react"
/**
 *  100 -> 500 / 1,000,000 = 0.0001 -> 0.01%
 *  500 -> 500 / 1,000,000 = 0.0005 -> 0.05%
    3000 -> 3000 / 1,000,000 = 0.003 -> 0.3%
    10000 -> 10000 / 1,000,000 = 0.01 -> 1%
 */
const feeTiers = [
    {value: 0.01, description: 'Best for very stable pairs.'}, 
    {value: 0.05, description: 'Best for stable pairs.'},
    {value: 0.3, description: 'Best for most pairs.'},
    {value: 1, description: 'Best for exotic pairs.'},
]
type FeeTierProps = {}
const FeeTier: React.FC<FeeTierProps> = () => {
    const [select, setSelect] = useState(2)
    
    return (
        <div className='py-5'>
                        <div className='pb-2'>Fee tier</div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                            {
                                feeTiers.map((feeTier, id) => (
                                    <div className='border-[1px] rounded-md border-zinc-700 p-3 cursor-pointer hover:bg-pink-600/15' onClick={() => setSelect(id)}>
                                        <div className='flex justify-between items-center'>
                                            <span className={`text-sm font-semibold ${select === id ? 'text-pink-600' : 'text-white'}`}>{feeTier.value}%</span>
                                            <SVGCheck className={`text-white bg-pink-600 rounded-full p-1 size-5 ${select === id ? '' : 'invisible'}`}/>
                                        </div>
                                        <div className='text-xs pt-2'><span>{feeTier.description}</span></div>
                                    </div>
                                ))
                            }
                        </div>
        </div>
    )
}

export default FeeTier