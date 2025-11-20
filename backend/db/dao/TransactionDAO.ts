import { TransactionDAOParamType, TransactionFilterType } from "./types";
import { Transaction } from "../models";
import logger from "../../helpers/logger";
import { TransactionError } from "../../routes/transaction/TransactionErros";
import { PaginationOptionType } from "../../controllers/types";

class TransactionDAO {
    async create(params: TransactionDAOParamType) {
        try {
            const transactionDao = new Transaction({
                chainId: params.chainId,
                tokenId: params.tokenId,
                tx: params.tx,
                token0: params.token0,
                token1: params.token1,
                txType: params.txType,
                amount0: params.amount0,
                amount1: params.amount1,
                usd: params.usd,
                from: params.from
            })
            const savedTransaction = await transactionDao.save()
            logger.debug('TransactionDAO.create. A new transaction is saved successfully', savedTransaction)
            return savedTransaction
        } catch (error: any) {
            logger.error('Failed to save transaction due to ', error)
            throw new TransactionError({key: 'transaction_create_failed', params:[params.chainId, params.from], errors: error.errors ? error.errors : error.message, code: 400})
        }
    }

    async queryByFilter(filter: TransactionFilterType) {
        const transactions = await Transaction.find(filter)
        return transactions
    }
    async queryByPagination(filter: TransactionFilterType, options: PaginationOptionType) {
        const pagination = await Transaction.paginate(filter, options)
        return pagination
    }
}

const transactionDao = new TransactionDAO()
export default transactionDao