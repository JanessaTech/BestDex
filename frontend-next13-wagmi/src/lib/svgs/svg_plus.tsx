import type { SVGProps } from "./types"

const SVGPlus:React.FC<SVGProps> = ({className, onClick}) => {
    return (
        <svg 
            onClick={onClick}
            className={`${className ? className : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

    )
}

export default SVGPlus