import { useEffect, useRef } from "react"

type UseOutsideClickCallbackType = () => void

const useOutsideClick = (callback : UseOutsideClickCallbackType) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleOutSideClick = (event: MouseEvent) => {
        console.log('handleOutSideClick')
        if (!ref.current?.contains(event.target as Node)) {
            callback()
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleOutSideClick); 
        console.log('add mousedown event listener')
        return ( () => {
            document.removeEventListener("mousedown", handleOutSideClick)
            console.log('remove mousedown event listener')
        })
    }, [])
    
    return ref
}

export default useOutsideClick