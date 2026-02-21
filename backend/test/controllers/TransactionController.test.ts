import request from 'supertest'
import app from '../../app'
import transactionService from '../../services/TransactionService';
import messageHelper from '../../helpers/internationalization/messageHelper';
import { TokenType } from '../../controllers/types';
import getConfig from '../../config/configuration';

const config = getConfig()
const apiPrefix = config.apiPrefix

jest.mock('../../services/TransactionService', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        getTransactions: jest.fn(),
    }
}))
jest.mock('../../helpers/logger', () => ({
    __esModule: true,
    default : {
        info: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
    }
}))
jest.mock('../../helpers/internationalization/messageHelper', () => ({
    __esModule: true,
    default : {
        getMessage: jest.fn(),
    }
}))

const mockedTransactionService = transactionService as jest.Mocked<typeof transactionService>
const mockedMessageHelper = messageHelper as jest.Mocked<typeof messageHelper>

describe('TransactionController', () => {
    beforeAll(() => {
        const mockWebsocketServer = {
            broadcast: jest.fn()
        }
        app.set('websocketServer', mockWebsocketServer);
    })
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /transactions', () => {
        const endpoint = apiPrefix + '/transactions'
        console.log('endpoint=', endpoint)
        const validBody = {
            chainId: '1',
            tx: '0x1234433333',
            token0: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            txType: 'Mint',
            amount0: '100',
            amount1: '200',
            usd: '300',
            from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        }
        it('should create a new transaction successfully', async () => {
            const createdTx = {
                id: 1,
                chainId: Number(validBody.chainId),
                tx: validBody.tx,
                token0: {chainId: Number(validBody.chainId), name: 'token0', symbol: 'symbol', decimal: 18, alias: 'token0', address: validBody.token0} as TokenType,
                token1: {chainId: Number(validBody.chainId), name: 'token1', symbol: 'symbol', decimal: 18, alias: 'token1', address: validBody.token1} as TokenType,
                txType: validBody.txType,
                amount0: validBody.amount0,
                amount1: validBody.amount1,
                usd: validBody.usd,
                from: validBody.from,
                createdAt: new Date()
            }
            mockedTransactionService.create.mockResolvedValue(createdTx)
            mockedMessageHelper.getMessage.mockReturnValue('Transaction created successfully');

            const response = await request(app)
                        .post(endpoint)
                        .send(validBody)
                        .expect(200)
            
            expect(mockedTransactionService.create).toHaveBeenCalledTimes(1)
            expect(response.body.success).toEqual(true)
        })
    })

    describe('GET /transactions/:chainId', () => {

    })
})