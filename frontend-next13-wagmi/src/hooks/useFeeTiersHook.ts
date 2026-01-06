import logger from "@/common/Logger"
import { getFeeTiersFromConfig } from "@/lib/client/Config"
import { ConfiguredFeeTier } from "@/lib/client/types"
import { useEffect, useState } from "react"

const useFeeTiersHook = (isWSConnected: boolean) => {
    const [feeTiers, setFeeTiers] = useState<ConfiguredFeeTier[]>([])

    useEffect(() => {
        if (isWSConnected) {
            (async () => {
                try {
                    const res = await getFeeTiersFromConfig()
                    if (!res) throw new Error('Failed to get the list of feeTiers')
                    setFeeTiers(res) 
                } catch(e) {
                    logger.error('[useFeeTiersHook] failed to get the feeTiers due to ', e)
                }
            })()
        }
        
    }, [isWSConnected])

    return feeTiers
}

export default useFeeTiersHook