import type { SvgProps } from "../types";

const Close: React.FC<SvgProps> = ({className}) => {
    return (
        <svg 
            className={`fill-current ${className}`}
            width="32" height="32"
            viewBox="0 0 1024 1024">
                <path d="m510.165 453.483-239.53-239.531-60.331 60.352 239.53 239.53-239.53 239.531 60.33 60.331 239.531-239.53L512 576l1.835-1.835 239.53 239.531 60.331-60.33-239.53-239.531 239.53-239.531-60.33-60.352-239.531 239.53L512 451.67z"/>
        </svg>
    )
}

export default Close