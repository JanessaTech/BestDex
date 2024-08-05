import type { SvgProps } from "../types";

const Withdraw: React.FC<SvgProps> = ({className}) => {
    return (
        <svg 
            className={`fill-current ${className}`}
            width="32" height="32" 
            viewBox="0 0 1024 1024">
                <path d="M501 221.1h-1.8v-81.7c0-22.4-25.1-35.7-43.6-23.1L162.1 315.7c-12.8 8.7-16.1 26-7.4 38.8 2 2.9 4.5 5.4 7.4 7.4l293.5 199.3c18.5 12.6 43.6-.7 43.6-23.1v-82.7h.1v-.1c137.5 2.3 250.4 99.6 256 224.6 4.4 97.9-58.4 184.7-151.5 224.8-1.7.7-3.5 2.2-3.3 5.1.1 2.4 2.5 3.1 4.7 2.4 149-43.8 258.7-172.6 262.8-327.5 5.3-195.2-159-358-367-363.6z"/>
        </svg>
    )
}

export default Withdraw