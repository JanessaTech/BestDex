import type { SvgProps } from "../types";

const ThreeLineArrow: React.FC<SvgProps> = ({className}) => {
    return (
        <svg 
            className={`fill-current ${className}`}
            width="32" height="32" 
            viewBox="0 0 1024 1024">
                <path d="M760.768 576 384 931.84l85.76 92.16L1024 515.392 474.048 0 384 98.88 753.6 448H0v128h760.768z"/>
        </svg>
    )
}

export default ThreeLineArrow