
import logger from "@/common/Logger"
import messageHelper from "@/common/internationalization/messageHelper"
import { PAGE_SIZE } from "@/config/constants"
import axios from 'axios'
import { DexResponseType, TransactionCreateInputType, TransactionInfoType } from "./types"

export const createTransaction = async (transaction: TransactionCreateInputType) => {
    logger.debug('[API client: transaction] createTransaction. transaction=', transaction)
    try {
        const response = await axios.post<DexResponseType<Record<'tx', TransactionInfoType>>>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/transactions`,transaction)
        logger.debug('response =', response)
        return response?.data?.data?.tx
    } catch (error: any) {
        const reason = error?.response?.data?.message || error?.message || error
        logger.error('[API client: transaction] createTransaction.', messageHelper.getMessage('transaction_create_failed', transaction, reason))
        logger.error(error)
        throw error
    }
}
    

export const getTransactionsByPage = async (chainId: number, from: `0x${string}`, page: number = 1) => {
    logger.debug('[API client: transaction] getTransactionsByPage. transaction=', 'chainId=', chainId, 'from=', from, 'page=', page)
    try {
        const response = await axios.get<DexResponseType<TransactionInfoType[]>>(`${process.env.NEXT_PUBLIC_BACKEND_ADDR}/apis/v1/transactions/${chainId}?from=${from}&pageSize=${PAGE_SIZE}&page=${page}`)
        const transactions = response?.data.data
        return transactions
    } catch (error: any) {
        const reason = error?.response?.data?.message || error?.message || error
        logger.error('[API client: transaction] getTransactionsByPage.', messageHelper.getMessage('transactions_get_failed', chainId, from, reason))
        logger.error(error)
        throw error
    }
    
}
