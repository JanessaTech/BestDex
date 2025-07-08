type SpinnerProps = {
    textSize?: string;
    circleSize?: string
}
const Spinner:React.FC<SpinnerProps> = ({textSize = 'text-sm', circleSize = 'w-20 h-20'}) => {
    return (
        <div className="relative flex justify-center items-center">
            <span className={`${textSize} text-white`}>Loading</span>
            <div className={`${circleSize} absolute border-4 border-pink-600 border-t-transparent rounded-full animate-spin`}/>
        </div>
    )
}

export default Spinner