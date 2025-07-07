import type { SVGProps } from "./types"

const SVGMinus: React.FC<SVGProps>= ({className, onClick}) => {
    return (
        <svg 
            onClick={onClick}
            className={`${className ? className : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
    )
}

export default SVGMinus