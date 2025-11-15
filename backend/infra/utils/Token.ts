import { toEventHash } from "viem"
import { tokenList } from "../../config/data/hardcode"


export const getTokenMeta = (chainId: number, address: `0x${string}`) => {
    const found = tokenList.find((e) => e.chainId === chainId)?.tokens?.find((token) => token.address.toLowerCase() === address.toLocaleLowerCase())
    return found
}