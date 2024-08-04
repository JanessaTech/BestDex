import Warning from "@/lib/svgs/Warning"

type PossibleWarningProps = {
    show: boolean
}

const PossibleWarning: React.FC<PossibleWarningProps> = ({show}) => {
    return (
        <div className={`text-xs px-2 pl-10 text-orange-800 bg-orange-200 rounded-md relative ${show ? '' : 'hidden'}`}>
            <Warning className="absolute left-2 top-1 w-[20px] h-[20px]"/>
            <span>Your position will not earn fees or be used in trades until the market price moves into your range.</span>
        </div>
    )
}

export default PossibleWarning