import { useEffect, useRef } from "react"

const useOutsideClick = (callback:(status: boolean) => void) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleOutSideClick = (event: MouseEvent) => {
        console.log('handleOutSideClick')
        console.log(event)
        console.log(ref)
        if (!ref.current?.contains(event.target as Node)) {
            callback(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleOutSideClick); 
        return ( () => 
            document.removeEventListener("mousedown", handleOutSideClick)
        )
    }, [ref])
    
    return ref
}

export default useOutsideClick