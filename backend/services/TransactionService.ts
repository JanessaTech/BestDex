import logger from "../helpers/logger";
import { TransactionError } from "../routes/transaction/TransactionErros";
import { PaginationOptionType, TransactionCreateInputType, TransactionInfoType } from "../controllers/types";
import { TransactionService } from "./types";
import transactionDao from "../db/dao/TransactionDAO";
import { getTokenMeta } from "../infra/utils/Token";
import { TRANSACTION_TYPE } from "../helpers/common/constants";
import { redisClient } from "../infra";
import messageHelper from "../helpers/internationalization/messageHelper";


class TransactionServiceImp implements TransactionService {
    private validateToken(chainId: number, token: `0x${string}`) {
        getTokenMeta(chainId, token)
    }

    private async invalidateUserPositions(chainId: number, owner: `0x${string}`) {
        const pattern = `positions:user:${owner}:chainId:${chainId}:page:*`
        logger.debug('TransactionService.invalidateUserPositions. Delete redis values by key:', pattern)
        const keys = await redisClient.getKeys(pattern)
        for (let key of keys) {
            const deleted = await redisClient.delete(key)
            if (!deleted) {
                logger.warning(messageHelper.getMessage('redis_delete_failed', key))
            }
        }
    }

    async create(params: TransactionCreateInputType) {
        logger.info('TransactionService.create')
        try {
            this.validateToken(params.chainId, params.token0 as `0x${string}`)
            this.validateToken(params.chainId, params.token1 as `0x${string}`)
            const raw = await transactionDao.create({...params})
            if (params.txType === TRANSACTION_TYPE.Mint || params.txType === TRANSACTION_TYPE.Increase || params.txType === TRANSACTION_TYPE.Decrease) {
                await this.invalidateUserPositions(params.chainId, params.from as `0x${string}`)
            }
            
            return {
                id: raw._id,
                chainId: params.chainId,
                tokenId: params.tokenId,
                tx: params.tx,
                token0: getTokenMeta(params.chainId, params.token0 as `0x${string}`),
                token1: getTokenMeta(params.chainId, params.token1 as `0x${string}`),
                txType: params.txType,
                amount0: params.amount0,
                amount1: params.amount1,
                usd: params.usd,
                from: params.from,
                createdAt: raw.createdAt
            } as TransactionInfoType
        } catch (error: any) {
            logger.error('Failed to create transaction: ', params, ' due to ', error)
            if (!(error instanceof TransactionError)) {
                throw new TransactionError({key: 'transaction_create_failed', params: [params.chainId, params.from],errors: error.errors ? error.errors : error.message, code: 400})
            }
            throw error
        }
    }

    async getTransactions(chainId: number, from: `0x${string}`,  page: number, pageSize: number) {
        logger.info(`TransactionService.create. chainId=${chainId}, from=${from}, page=${page}, pageSize=${pageSize}`)
        try {
            const filter = {chainId: chainId, from: from}
            const options: PaginationOptionType = {page: page, pageSize: pageSize}
            const pagination = await transactionDao.queryByPagination(filter, options)
            try {
                pagination.results = (pagination.results as any[]).map((result) => ({
                    id: result._id,
                    chainId: result.chainId,
                    tokenId: result.tokenId,
                    tx: result.tx,
                    token0: getTokenMeta(chainId, result.token0 as `0x${string}`),
                    token1: getTokenMeta(chainId, result.token1 as `0x${string}`),
                    txType: result.txType,
                    amount0: result.amount0,
                    amount1: result.amount1,
                    usd: result.usd,
                    from: result.from,
                    createdAt: result.createdAt
                } as TransactionInfoType))
                return pagination
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