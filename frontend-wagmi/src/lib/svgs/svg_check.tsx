import type { SVGProps } from "./types"

const SVGCheck:React.FC<SVGProps> = ({className}) => {
    return (
        <svg 
            className={`${className ? className : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    )
}

export default SVGCheck