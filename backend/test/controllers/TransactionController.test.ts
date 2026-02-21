import request from 'supertest'
import app from '../../app'
import transactionService from '../../services/TransactionService';
import messageHelper from '../../helpers/internationalization/messageHelper';
import { PaginationReturnType, TokenType, TransactionInfoType } from '../../controllers/types';
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

    const chainId = 1
    const token0 = {chainId: chainId, name: 'token0', symbol: 'symbol', decimal: 18, alias: 'token0', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'} as TokenType
    const token1 = {chainId: chainId, name: 'token1', symbol: 'symbol', decimal: 18, alias: 'token1', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'} as TokenType

    describe('POST /transactions', () => {
        const endpoint = apiPrefix + '/transactions'
        const from = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
        const validBody = {
            chainId: chainId,
            tx: '0x1234433333',
            token0: token0.address,
            token1: token1.address,
            txType: 'Mint',
            amount0: '100',
            amount1: '200',
            usd: '300',
            from: from,
        }

        const invalidBody = {
            chainId: chainId,
            tx: '0x1234433333',
            token0: '0xinvalidhash',
            token1: token1.address,
            txType: 'Mint',
            amount0: '100',
            amount1: '200',
            usd: '300',
            from: from,
        }
        it('should create a new transaction successfully', async () => {
            const createdTx = {
                id: 1,
                chainId: chainId,
                tx: validBody.tx,
                token0: token0,
                token1: token1,
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
        it('failed to create a new transaction', async function() {
            const createdTx = {
                id: chainId,
                chainId: chainId,
                tx: invalidBody.tx,
                token0: token0,
                token1: token0,
                txType: invalidBody.txType,
                amount0: invalidBody.amount0,
                amount1: invalidBody.amount1,
                usd: invalidBody.usd,
                from: invalidBody.from,
                createdAt: new Date()
            }
            mockedTransactionService.create.mockResolvedValue(createdTx)
            mockedMessageHelper.getMessage.mockReturnValue('Transaction created successfully');

            const response = await request(app)
                        .post(endpoint)
                        .send(invalidBody)
                        .expect(400)
            expect(response.body.success).toEqual(false)
        })
    })

    describe('GET /transactions/:chainId', () => {
        const baseUrl = apiPrefix + `/transactions/${chainId}`
        const from = '0xf39fd6e51aad88f6f4ce6ab8827279cfffB92266'.toLocaleLowerCase()
        it('should return transactions list with pagination',async function() {
            const page = 1
            const pageSize = 3
            const totalPages = 1
            const totalResults = 2

            const mockedTxs: TransactionInfoType[] = [
                {id: 1, chainId: chainId, tx: "0x123", token0: token0, token1: token0, txType: 'Mint', amount0: '100', amount1: '200', usd: '300', from: from, createdAt: new Date()},
                {id: 2, chainId: chainId, tx: "0x456", token0: token0, token1: token0, txType: 'Mint', amount0: '100', amount1: '200', usd: '300', from: from, createdAt: new Date()},
                {id: 3, chainId: chainId, tx: "0x789", token0: token0, token1: token0, txType: 'Mint', amount0: '100', amount1: '200', usd: '300', from: from, createdAt: new Date()},
            ]
            const returnedPagination = {
                results: mockedTxs,
                page: page,
                pageSize:pageSize,
                totalPages: totalPages,
                totalResults: totalResults
            } as PaginationReturnType
            const emptyReturnedPagination = {
                results: [],
                page: page,
                pageSize:pageSize,
                totalPages: totalPages,
                totalResults: totalResults
            } as PaginationReturnType

            mockedTransactionService.getTransactions.mockImplementation(
                async (_chainId, _from, _page, _pageSize) => {
                    if (
                        _chainId === chainId &&
                        _from === from &&
                        _page === page &&
                        _pageSize === pageSize
                      ) {
                        return returnedPagination
                      } else {
                        return emptyReturnedPagination
                      }
                }
            )

            const response = await request(app)
                        .get(baseUrl)
                        .query({
                            from : from,
                            page: page,
                            pageSize: pageSize
                        })
                        .expect(200)
            expect(response.body.data.results).toHaveLength(3)
            expect(mockedTransactionService.getTransactions).toHaveBeenCalledWith(
                chainId, from, page, pageSize
            )
        })
    })
})