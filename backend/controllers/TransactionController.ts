import { Request, Response, NextFunction } from "express"
import logger from "../helpers/logger"
import messageHelper from "../helpers/internationalization/messageHelper"

class TransactionController {

    async getTransactions(req: Request, res: Response, next: NextFunction) {

    }
    async createTransaction(req: Request, res: Response, next: NextFunction) {

    }
}

const controller = new TransactionController()
export default controller