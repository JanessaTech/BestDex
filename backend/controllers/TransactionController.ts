import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"
import { TransactionCreateInputType } from "./types"
import transactionService from '../services/TransactionService'
import { sendSuccess } from "../routes/ReponseHandler"
import { waitForCallsStatus } from "viem/_types/actions/wallet/waitForCallsStatus"

class TransactionController {

    async create(req: Request, res: Response, next: NextFunction) {
        logger.info("TransactionController.create")
        try {
            const transaction: TransactionCreateInputType = {
                chainId: Number(req.body.chainId),
                tokenId: req.body.tokenId,
                tx: req.body.tx,
                token0: req.body.token0.toString().toLowerCase(),
                token1: req.body.token1.toString().toLowerCase(),
                txType: req.body.txType,
                amount0: Number(req.body.amount0),
                amount1: Number(req.body.amount1),
                usd: Number(req.body.usd),
                from: req.body.from.toString().toLowerCase(),
            }
            logger.debug('transaction=', transaction)
            const payload = await transactionService.create(transaction)
            sendSuccess(res, messageHelper.getMessage('transaction_create_success', transaction.chainId, transaction.from), {tx: payload})
        } catch (e) {
            next(e)
        }
    }

    async getTransactions(req: Request, res: Response, next: NextFunction) {
        logger.info('TransactionController.getTransactions')
        const chainId = Number(req.params.chainId)
        const from = req.query.from?.toString().toLowerCase() as `0x${string}`
        const page = Number(req.query.page ? req.query.page : 1)
        const pageSize = Number(req.query.pageSize)
        logger.debug('chainId =', chainId)
        logger.debug('from =', from)
        logger.debug('page =', page)
        logger.debug('pageSize =', pageSize)
        try {
            const payload = await transactionService.getTransactions(chainId, from, page, pageSize)
            sendSuccess(res, messageHelper.getMessage('transaction_getlist_success', chainId, from), payload)
        } catch(e) {
            next(e)
        }
    }
}

const controller = new TransactionController()
export default controller