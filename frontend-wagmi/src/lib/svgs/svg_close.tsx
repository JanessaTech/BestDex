import type { SVGProps } from "./types"

const SVGClose: React.FC<SVGProps> = ({className, onClick}) => {
    return (
        <svg 
            onClick={onClick}
            className={`${className ? className : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
    )
}

export default SVGClose