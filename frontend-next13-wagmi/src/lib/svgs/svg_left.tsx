import type { SVGProps } from "./types"

const SVGLeft: React.FC<SVGProps> = ({className, onClick}) => {
    return (
        <svg 
            className={`${className ? className : ''}`}
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
    )
}

export default SVGLeft