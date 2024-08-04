import Correct from "@/lib/svgs/Correct"

type FeeTierProps = {
    content: string,
    tier: number
    isSelected: boolean,
    select: number
    handleTierChoose: (tier: number) => void
}

const FeeTier: React.FC<FeeTierProps> = ({content, tier, isSelected, select, handleTierChoose}) => {

    return (
        <div className={`border border-zinc-300 text-sm rounded-lg p-2 
            flex flex-col justify-between
            cursor-pointer hover:border-sky-500 ${isSelected ? 'border-sky-500' : ''}`}
            onClick={ () => handleTierChoose(tier)}>
            <div className='flex justify-between'>
                <span className="font-semibold">{tier}%</span>
                <Correct className={`w-[20px] h-[20px] ${isSelected ? 'text-sky-500' : ''}`}/>
            </div>
            <div className="text-xs my-1 font-light">{content}</div>
            <div className="bg-zinc-500 rounded-md p-1 text-xs w-fit mt-1">{select}% select</div>
        </div>
    )
}

export default FeeTier