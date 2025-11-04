import axios from 'axios'

export const getLatestPrices = async () => {
    console.log('[API client: TokenPrices]: getLatestPrices')
    try {
        const response = await axios.get<DexResponseType>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/price/getTokenPrices`)
        //console.log('response: ', response)
        return response?.data?.data
    } catch (error:any) {
        const reason = error?.response?.data?.message || error?.message || error
        console.log(reason)
        throw error
    }
}