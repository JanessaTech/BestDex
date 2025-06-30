import { ethers, providers, BigNumber} from 'ethers'
import JSBI from 'jsbi'
import {
    AlphaRouter,
    SwapOptionsSwapRouter02,
    SwapRoute,
    SwapType
  } from '@uniswap/smart-order-router'
import { ChainId, CurrencyAmount, Percent, Token, TradeType} from '@uniswap/sdk-core';
import { ERC20_ABI, TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER, V3_SWAP_ROUTER_ADDRESS } from './constant';

const mainnetProvider = new ethers.providers.JsonRpcProvider('')
const localProvider = new ethers.providers.JsonRpcProvider('')
const recipient = ''
const WETH_TOKEN = new Token(
    1,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
)
const USDC_TOKEN = new Token(
    1,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
)

const tokens =  {
    in: WETH_TOKEN,
    amountIn: 1,
    out: USDC_TOKEN,
}
export enum TransactionState {
    Failed = 'Failed',
    New = 'New',
    Rejected = 'Rejected',
    Sending = 'Sending',
    Sent = 'Sent',
  }
  const walletInfo =  {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey:
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  }

const wallet = createWallet()
function createWallet(): ethers.Wallet {
    let provider = mainnetProvider
    //provider = localProvider
    return new ethers.Wallet(walletInfo.privateKey, provider)
}

export function getProvider(): providers.Provider | null {
    return wallet.provider
  }

function fromReadableAmount(amount: number, decimals: number): JSBI {
    const extraDigits = Math.pow(10, countDecimals(amount))
    const adjustedAmount = amount * extraDigits
    return JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(adjustedAmount),
        JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
      ),
      JSBI.BigInt(extraDigits)
    )
  }

function countDecimals(x: number) {
    if (Math.floor(x) === x) {
        return 0
    }
    return x.toString().split('.')[1].length || 0
}

export async function generateRoute(): Promise<SwapRoute | null> {
    const router = new AlphaRouter({
        chainId: ChainId.MAINNET,
        provider: mainnetProvider,
      })
    const options: SwapOptionsSwapRouter02 = {
        recipient: recipient,
        slippageTolerance: new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),
        type: SwapType.SWAP_ROUTER_02,
    }

    const route = await router.route(
        CurrencyAmount.fromRawAmount(
            WETH_TOKEN,
          fromReadableAmount(
            tokens.amountIn,
            tokens.in.decimals
          ).toString()
        ),
        tokens.out,
        TradeType.EXACT_INPUT,
        options
      )
    

    return route
}





export async function executeRoute(route: SwapRoute): Promise<TransactionState>  {
    const walletAddress = wallet.address
    const provider = getProvider()

    if (!provider) {
        return TransactionState.Failed
    }
    


    return TransactionState.New
}

export async function sendTransaction(
    transaction: ethers.providers.TransactionRequest
  ): Promise<TransactionState> {
    return sendTransactionViaWallet(transaction)
  }

  async function sendTransactionViaWallet(
    transaction: ethers.providers.TransactionRequest
  ): Promise<TransactionState> { 
    const provider = getProvider()

    if (!provider) {
        return TransactionState.Failed
    }

    if (transaction.value) {
        transaction.value = BigNumber.from(transaction.value)
    }
    const txRes = await wallet.sendTransaction(transaction)
    let receipt = null
    while (receipt === null) {
        try {
            receipt = await provider.getTransactionReceipt(txRes.hash)
      
            if (receipt === null) {
              continue
            }
          } catch (e) {
            console.log(`Receipt error:`, e)
            break
          }
    }
    if (receipt) {
        return TransactionState.Sent
    } else {
        return TransactionState.Failed
    }
  }


export async function getTokenTransferApproval(token: Token): Promise<TransactionState> {
    const walletAddress = wallet.address
    const provider = wallet.provider

    try {
        const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider)
        const transaction = await tokenContract.populateTransaction.approve(
            V3_SWAP_ROUTER_ADDRESS,
            fromReadableAmount(
              TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
              token.decimals
            ).toString()
          )
        
        
        
    } catch (e) {

    }

    return TransactionState.New
}