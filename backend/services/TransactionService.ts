import logger from "../helpers/logger";
import { TransactionError } from "../routes/transaction/TransactionErros";
import { TransactionCreateInputType, TransactionInfoType } from "../controllers/types";
import { TransactionService } from "./types";
import transactionDao from "../db/dao/TransactionDAO";
import { getTokenMeta } from "../infra/utils/Token";


class TransactionServiceImp implements TransactionService {
    async create(params: TransactionCreateInputType) {
        logger.info('TransactionService.create')
        try {
            const tx = await transactionDao.create({...params})
            return tx
        } catch (error) {
            logger.error('Failed to create transaction: ', params)
            throw error
        }
    }

    async getTransactions(chainId: number, from: `0x${string}`,  page: number, pageSize: number) {
        logger.info(`TransactionService.create. chainId=${chainId}, from=${from}, page=${page}, pageSize=${pageSize}`)
        try {
            const filter = {chainId: chainId, from: from}
            const rawTransactions = await transactionDao.queryByFilter(filter)
            try {
                const transactions = rawTransactions.map((raw) => ({
                    id: raw._id,
                    chainId: raw.chainId,
                    tokenId: raw.tokenId,
                    tx: raw.tx,
                    token0: getTokenMeta(chainId, raw.token0 as `0x${string}`),
                    token1: getTokenMeta(chainId, raw.token1 as `0x${string}`),
                    txType: raw.txType,
                    amount0: raw.amount0,
                    amount1: raw.amount1,
                    usd: raw.usd,
                    from: raw.from,
                    createdAt: raw.createdAt
                } as TransactionInfoType))
                return transactions
            } catch (error: any) {
                throw new TransactionError({key: 'transaction_conversion_failed', params: [error.message]})
            }
        } catch(error) {
            logger.error(`Failed to the transaction list. chainId=${chainId}, from=${from}, page=${page}, pageSize=${pageSize} due to:`, error)
            if (!(error instanceof TransactionError)) {
                throw new TransactionError({key: 'transaction_getlist_failed', params: [chainId, from]})
            }
            throw error
        }
    }
}

const transactionService = new TransactionServiceImp()
export default transactionService