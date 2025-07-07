import { usePathname } from "next/navigation"


const useURLHook = () => {
    const pathname = usePathname()
    const getCurrentPath = () => {
        return pathname === '/' ? 'swap' : pathname.substring(1)
    }
    return {getCurrentPath}
}

export default useURLHook