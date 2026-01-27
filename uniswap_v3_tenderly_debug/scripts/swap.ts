import { ethers, providers, BigNumber} from 'ethers'
import JSBI from 'jsbi'
import {
    AlphaRouter,
    NATIVE_CURRENCY,
    SwapOptionsSwapRouter02,
    SwapRoute,
    SwapType,
    
  } from '@uniswap/smart-order-router'
import { CurrencyAmount, Currency, Percent, Rounding, Token, TradeType} from '@uniswap/sdk-core';
import { Decimal } from 'decimal.js';

const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am")
const localProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
//const localProvider = new ethers.providers.JsonRpcProvider('https://virtual.mainnet.eu.rpc.tenderly.co/788e8993-30e7-40ea-8442-f5b91c13efd0')

// Addresses
const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
const WETH_CONTRACT_ADDRESS =
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

// ABI's
const ERC20_ABI = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
  
    // Authenticated Functions
    'function transfer(address to, uint amount) returns (bool)',
    'function approve(address _spender, uint256 _value) returns (bool)',
  
    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)',
  ]

// Transactions

const MAX_FEE_PER_GAS = 100000000000
const MAX_PRIORITY_FEE_PER_GAS = 100000000000
const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 10000

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

const OCEAN_TOKEN = new Token(
  1,
  '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
  18,
  'OCEAN',
  'Ocean Token'
)

const WBTC_TOKEN = new Token(
  1, 
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
  )

const MEME_TOKEN = new Token(
  1, 
  '0xb131f4a55907b10d1f0a50d8ab8fa09ec342cd74',
  18,
  'MEME',
  'Memecoin'
  )

const tokens =  {
    in: WETH_TOKEN,
    amountIn: 1,
    out: USDC_TOKEN,
}
enum TransactionState {
    Failed = 'Failed',
    New = 'New',
    Rejected = 'Rejected',
    Sending = 'Sending',
    Sent = 'Sent',
  }
  const walletInfo =  {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey:
      'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  }

const wallet = createWallet()
function createWallet(): ethers.Wallet {
    let provider = mainnetProvider
    provider = localProvider
    return new ethers.Wallet(walletInfo.privateKey, provider)
}

console.log('wallet.address:', wallet.address)

function getProvider(): providers.Provider | null {
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

async function generateRoute(): Promise<SwapRoute | null> {
    const router = new AlphaRouter({
        chainId: 1,
        provider: mainnetProvider,
      })
    const options: SwapOptionsSwapRouter02 = {
        recipient: wallet.address,
        slippageTolerance: new Percent(100, 10_000),  //new Percent(50, 10_000),
        deadline: Math.floor(Date.now() / 1000 + 1800),  // in 30 mins
        type: SwapType.SWAP_ROUTER_02,
    }

    const route = await router.route(
        CurrencyAmount.fromRawAmount(
          tokens.in,
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

async function executeRoute(route: SwapRoute): Promise<TransactionState>  {
    const walletAddress = wallet.address
    const provider = getProvider()
    const feeData = await provider?.getFeeData()
    const baseFee = feeData?.lastBaseFeePerGas
    const maxFeePerGas  = feeData?.maxFeePerGas
    const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas
    console.log('baseFee=', baseFee)
    console.log('maxFeePerGas=', maxFeePerGas)
    console.log('maxFeePerGas.mul(2)=', maxFeePerGas ? maxFeePerGas.mul(2) : maxFeePerGas)
    console.log('maxPriorityFeePerGas=', maxPriorityFeePerGas)

    if (!walletAddress || !provider) {
      return TransactionState.Failed
    }
    
    const tokenApproval = await getTokenTransferApproval(tokens.in)
    // Fail if transfer approvals do not go through
    if (tokenApproval !== TransactionState.Sent) {
        return TransactionState.Failed
    }
    console.log('tokenApproval=', tokenApproval)
    const res = await sendTransaction({
        data: route.methodParameters?.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: route?.methodParameters?.value,
        gasLimit: '30000000',
        from: walletAddress,
        maxFeePerGas: maxFeePerGas ? maxFeePerGas.mul(2) : MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: maxPriorityFeePerGas ? maxPriorityFeePerGas : MAX_PRIORITY_FEE_PER_GAS,
      })
    return res
    //return TransactionState.Sent
}

async function sendTransaction(
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
    console.log(txRes)
    let receipt = null
    while (receipt === null) {
        try {
            receipt = await provider.getTransactionReceipt(txRes.hash)
      
            if (receipt === null) {
              continue
            }
            console.log(receipt)
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

async function getTokenTransferApproval(token: Token): Promise<TransactionState> {
    const walletAddress = wallet.address
    const provider = getProvider()
    if (!provider) {
      return TransactionState.Failed
    }
    try {
        const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider)
        const transaction = await tokenContract.populateTransaction.approve(
            V3_SWAP_ROUTER_ADDRESS,
            fromReadableAmount(
              TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
              token.decimals
            ).toString()
        )
        return sendTransaction({...transaction, from: walletAddress})
    } catch (e) {
        console.error(e)
        return TransactionState.Failed
    }
}

async function getGasPrice() {
  try {
    // 获取当前Gas价格（传统模式）
    const legacyGasPrice = await mainnetProvider.getGasPrice();
    console.log(`Legacy Gas Price: ${ethers.utils.formatUnits(legacyGasPrice, "gwei")} Gwei`);

    // 获取EIP-1559费用参数（推荐）
    const feeData = await mainnetProvider.getFeeData();
    console.log(`
      EIP-1559 Fee Data:
      - Max Fee: ${ethers.utils.formatUnits(feeData.maxFeePerGas || 0 , "gwei")} Gwei
      - Max Priority Fee: ${ethers.utils.formatUnits(feeData.maxPriorityFeePerGas || 0, "gwei")} Gwei
      - Base Fee: ${ethers.utils.formatUnits(feeData.lastBaseFeePerGas || 0, "gwei")} Gwei
    `);

    return { legacyGasPrice, feeData };
  } catch (error) {
    console.error("Error fetching gas price:", error);
    throw error;
  }
}

async function main() {
  try {
    const route = await generateRoute()
    if (!route) throw new Error('failed to get route')
    const gasPrice = (await mainnetProvider.getGasPrice()).toString()
    console.log('The best price:', route?.quote.toExact())
    console.log('PoolIdentifiers:', route?.route.map((r) => r.poolIdentifiers))
    console.log('The path detail:', route?.route.map((r) => r.tokenPath.map((t) => t.symbol).join(' -> ')).join(', '))
    console.log('Estimated Gas:', route?.estimatedGasUsed.toString())
    console.log('Estimated Gas(gwei):', new Decimal(route?.estimatedGasUsed.toString()).dividedBy(1000000000).toString())
    console.log('getGasPrice:', gasPrice)
    console.log('cost(eth): ', new Decimal(route?.estimatedGasUsed.toString()).times(new Decimal(gasPrice)).div('1000000000000000000').toDecimalPlaces(18, Decimal.ROUND_HALF_UP).toString())
    console.log('Estimated USD:', route?.estimatedGasUsedUSD.toFixed(2))
    await getGasPrice()
    const calldata = route.methodParameters?.calldata
    console.log('-----------calldata----------')
    console.log(calldata)
    console.log('------end of -----calldata----------')
    const res = await executeRoute(route)
    console.log('executeRoute result: ', res)
  } catch (e) {
    console.error(e)
  }
}

main().then().catch(e => {
  console.error(e)
})

//npx hardhat run scripts\swap.ts