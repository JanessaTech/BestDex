import type { SvgProps } from "../types";

const Explore: React.FC<SvgProps> = ({className}) => {
    return (
        <svg 
            className={`fill-current ${className}`}
            width="36" height="32" 
            viewBox="0 0 1152 1024">
                <path d="M1145.04 482.8C1036.58 271.18 821.86 128 576 128S115.36 271.28 6.96 482.82a64.7 64.7 0 0 0 0 58.38C115.42 752.82 330.14 896 576 896s460.64-143.28 569.04-354.82a64.7 64.7 0 0 0 0-58.38zM576 800a288 288 0 1 1 288-288 287.86 287.86 0 0 1-288 288zm0-480a190.62 190.62 0 0 0-50.62 7.58 95.7 95.7 0 0 1-133.8 133.8A191.56 191.56 0 1 0 576 320z"/>
        </svg>
    )
}

export default Explore