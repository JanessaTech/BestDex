
import type { SvgProps } from "../types";

const GoUp: React.FC<SvgProps> = ({className}) => {
    return (    
        <svg 
            className={`fill-current ${className}`}
            width="32" height="32" 
            viewBox="0 0 1024 1024">
                <path d="M887.824 934.637c-4.157 15.672-19.986 25.196-35.458 21.474-15.5-3.781-25.124-19.452-21.013-35.472l35.114-140.074V487.748c0-11.936-6.207-19.44-14.103-22.514-3.1-1.356-7.575-2.021-11.342-2.021-4.157 0-8.284.665-11.747 2.02-7.533 3.075-13.075 9.917-13.74 21.505v33.048c0 16.02-13.421 28.978-29.254 28.978s-28.588-12.959-28.588-28.978v-75.318c0-11.95-6.87-19.44-14.461-22.874-3.45-1.358-7.563-2.021-10.997-2.021-4.82 0-8.948.663-12.036 2.021-7.592 3.433-13.437 10.232-14.144 21.502v76.69c0 16.02-13.075 28.978-29.252 28.978-15.833 0-28.56-12.959-28.56-28.978v-86.59c0-12.612-6.206-20.116-13.77-22.832-4.125-1.009-8.253-1.717-11.702-1.717-4.489 0-8.24.707-12.05 1.717-7.59 2.715-13.753 10.219-13.753 21.463V519.787c0 16.02-13.435 28.98-29.254 28.98-15.859 0-29.266-12.96-29.266-28.98V240.968c0-11.618-5.832-19.44-14.117-23.22-3.46-1.012-6.881-1.676-11.355-1.676-3.812 0-8.284.664-11.359 1.675-7.562 3.781-14.489 11.603-14.489 23.221v461.524c0 15.672-12.353 28.3-28.892 28.3-15.817 0-29.252-12.628-29.252-28.3V575.36c-.354-11.272-6.208-18.429-14.101-22.166-3.101-.694-6.912-1.372-11.387-1.372-3.773 0-8.248.678-11.35 1.372-7.577 3.737-13.744 11.59-13.744 23.524v143.839c0 56.932 1.694 59.314 31.647 97.818l8.256 9.9 63.34 82.143c10.334 12.946 7.215 30.669-4.835 40.554-13.075 9.568-31.303 6.84-41.274-5.802l-63.342-81.783-8.592-10.565c-40.994-52.153-43.743-55.92-43.743-132.265V576.719c0-39.89 22.031-65.13 50.612-76.372 10.326-4.432 21.676-6.15 33.025-6.15 8.285 0 17.24 1.053 25.488 3.782V240.967c0-39.544 22.382-65.13 50.61-76.025 10.997-4.432 22.701-6.148 33.38-6.148 11.357 0 22.386 1.717 33.035 6.148 28.576 10.896 50.959 36.483 50.959 76.025v113.16c7.894-2.051 16.494-3.422 25.804-3.422 11.025 0 22.037 1.719 33.063 6.147 10.335 4.432 19.945 10.882 28.2 19.093 4.82-3.42 9.293-5.802 14.49-7.504 10.635-4.43 21.676-6.492 33.712-6.492 10.65 0 21.677 2.064 33.034 6.492 18.919 7.504 35.457 22.471 43.712 42.616 10.335-3.766 21.706-5.785 32.04-5.785 10.998 0 22.687 2.712 33.365 6.45 28.242 11.243 50.28 37.176 50.28 76.027v296.556c0 2.064-.362 4.429-.723 6.133l-36.121 144.199zM144.999 322.434c-11.35 11.907-29.924 11.907-41.274 0-11.386-10.924-11.386-29.007 0-40.597l95.341-94.73c12.023-11.271 30.633-11.271 41.276 0l96.05 94.73c11.024 11.59 11.024 29.672 0 40.597-10.998 11.907-29.96 11.907-41.31 0L248.98 277.09v257.358c0 15.673-13.083 28.978-28.942 28.978-15.826 0-29.253-13.303-29.253-28.978v-257.36l-45.785 45.346z"/>
        </svg>
    )
}

export default GoUp