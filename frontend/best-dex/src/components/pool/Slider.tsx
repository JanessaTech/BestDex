type SliderProps = {}

const Slider: React.FC<SliderProps> = () => {
    return(
        <div>
            <input type="range" className="w-full" />
        </div>
    )
}

export default Slider