import type { SVGProps } from "./types";

const SVGZoomIn: React.FC<SVGProps> = ({className, onClick}) => {
    return (
        <svg 
            onClick={onClick}
            className={`${className ? className : ''}`}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
       </svg>
    )
}

export default SVGZoomIn