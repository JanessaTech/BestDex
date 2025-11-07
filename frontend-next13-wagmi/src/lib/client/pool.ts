import axios from 'axios'
import { PoolInfo } from '../tools/pool'

export const fetchLatestPoolInfo = async (poolAddress: `0x${string}`, chainId: number) => {
    console.log('[API client: pool]: fetchLatestPoolInfo. ')
    try {
        const response = await axios.get<DexResponseType<PoolInfo>>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/pool/getLatestPoolInfo/${chainId}?poolAddress=${poolAddress}`)
        const pooInfo = response?.data.data
        if (!pooInfo) throw new Error('pooInfo is null')
        return pooInfo
    } catch (error:any) {
        const reason = error?.response?.data?.message || error?.message || error
        console.log(error)
        console.log(reason)
        throw error
    }
}