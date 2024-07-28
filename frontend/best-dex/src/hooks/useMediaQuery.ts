import { useEffect } from "react"

type UseMediaQueryCallbackType = () => void

const useMediaQuery = (callback : UseMediaQueryCallbackType) => {
    const handleMediaQueryChange = () => {
        console.log('handleMediaQueryChange')
        callback()
    }

    useEffect( () => {
        const mediaQuery = '(max-width: 768px)';
        const mediaQueryList = window.matchMedia(mediaQuery);
        mediaQueryList.addEventListener('change', handleMediaQueryChange)
        console.log('add media query event listener')
        return ( () => {
            mediaQueryList.removeEventListener('change', handleMediaQueryChange)
            console.log('remove media query event listener')
        })
    }, [])
}

export default useMediaQuery