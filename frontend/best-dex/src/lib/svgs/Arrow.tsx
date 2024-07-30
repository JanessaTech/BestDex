import type { SvgProps } from "../types";

const Arrow: React.FC<SvgProps> = ({className, onClick}) => {
    return (
        <svg 
            className={`fill-current ${className}`}
            width="32" height="32" 
            viewBox="0 0 1024 1024"
            onClick={ () => onClick ? onClick() : () => {}}
            >
                <path d="M472.064 751.552 72.832 352.32c-22.08-22.08-22.08-57.792 0-79.872 22.016-22.016 57.792-22.08 79.872 0L512 631.744l359.296-359.296c22.016-22.016 57.792-22.08 79.872 0s22.016 57.792 0 79.872L551.936 751.552c-22.08 22.016-57.792 22.016-79.872 0z"/>
        </svg>
    )
}

export default Arrow