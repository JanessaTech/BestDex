'use client'

import useURLHook from "@/hooks/useURLHook"
import { createContext, useContext } from "react"

export interface IContextUtil {
    getCurrentPath: () => string
}

const ContextUtil = createContext<IContextUtil | undefined>(undefined)

type ContextUtilProviderProps = {children: React.ReactNode}
const ContextUtilProvider:React.FC<ContextUtilProviderProps> = ({children}) => {
    const {getCurrentPath} = useURLHook()
    return (
        <ContextUtil.Provider value={{getCurrentPath}}>
                {children}
        </ContextUtil.Provider>
    )
}
export const useContextUtil = () => useContext(ContextUtil)
export default ContextUtilProvider