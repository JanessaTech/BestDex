import logger from "../helpers/logger";
import { TransactionError } from "../routes/transaction/TransactionErros";
import messageHelper from "../helpers/internationalization/messageHelper";
import { TransactionCreateInputType } from "../controllers/types";
import { TransactionService } from "./types";
import transactionDao from "../db/dao/TransactionDAO";


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
            const transactions = await transactionDao.queryByFilter(filter)
            return transactions
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