import type { SvgProps } from "../types";

const Add: React.FC<SvgProps> = ({className}) => {
    return (
        <svg 
            className={`fill-current ${className}`}
            width="32" height="32" 
            viewBox="0 0 1024 1024">
                <path d="M588.8 435.2h358.4a76.8 76.8 0 1 1 0 153.6H588.8v358.4a76.8 76.8 0 1 1-153.6 0V588.8H76.8a76.8 76.8 0 1 1 0-153.6h358.4V76.8a76.8 76.8 0 1 1 153.6 0v358.4z"/>
        </svg>
    )
}

export default Add