import type { SvgProps } from "../types";

const Pool: React.FC<SvgProps> = ({className}) => {
    return (
        <svg 
            className={`fill-current ${className}`}
            width="48" height="48" 
            viewBox="0 0 1024 1024">
                <path d="M511.317 1024a398.677 398.677 0 0 1-374.784-375.467c0-197.973 290.134-535.21 374.784-648.533 84.651 113.323 341.334 449.877 341.334 647.85S694.272 1024 511.317 1024z"/>
        </svg>
    )
}

export default Pool