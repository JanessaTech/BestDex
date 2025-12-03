import useFeeTiersHook from "@/hooks/useFeeTiersHook"
import SVGCheck from "@/lib/svgs/svg_check"
import { useState } from "react"

type FeeTierProps = {
    handleFeeAmountChange: (_feeAmount: number) => void
}
const FeeTier: React.FC<FeeTierProps> = ({handleFeeAmountChange}) => {
    const [select, setSelect] = useState(2)
    const feeTiers = useFeeTiersHook()

    const handleFeeSelect = (id: number) => {
        setSelect(id)
        const feeAmount = feeTiers[id].value * 10000
        handleFeeAmountChange(feeAmount)
    }

    return (
        <div className='py-5'>
                        <div className='pb-2'>Fee tier</div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                            {
                                feeTiers.map((feeTier, id) => (
                                    <div key={id} className='border-[1px] rounded-md border-zinc-700 p-3 cursor-pointer hover:bg-pink-600/15' onClick={() => handleFeeSelect(id)}>
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