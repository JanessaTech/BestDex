import { ethers, providers, BigNumber} from 'ethers'
import { 
        FeeAmount , 
        Position, 
        computePoolAddress, 
        nearestUsableTick,
        NonfungiblePositionManager,
        MintOptions,
        AddLiquidityOptions,
        RemoveLiquidityOptions,
        CollectOptions,
        Pool} from '@uniswap/v3-sdk'
import {CurrencyAmount, Token, ChainId, Percent } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

const USDC_TOKEN = new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD//C'
)
const DAI_TOKEN = new Token(
    ChainId.MAINNET,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18,
    'DAI',
    'Dai Stablecoin'
  )
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
const NONFUNGIBLE_POSITION_MANAGER_ABI = [
  // Read-Only Functions
  'function balanceOf(address _owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',

  'function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)',
]
const tokens =  {
    token0: USDC_TOKEN,
    token0Amount: 1000,
    token1: DAI_TOKEN,
    token1Amount: 1000,
    poolFee: FeeAmount.LOW,
    fractionToRemove: 1,
    fractionToAdd: 0.5,
    token0AmountToCollect: 10,
    token1AmountToCollect: 10,
}
interface PoolInfo {
    token0: string
    token1: string
    fee: number
    tickSpacing: number
    sqrtPriceX96: ethers.BigNumber
    liquidity: ethers.BigNumber
    tick: number
}
interface PositionInfo {
  tickLower: number
  tickUpper: number
  liquidity: BigNumber
  feeGrowthInside0LastX128: BigNumber
  feeGrowthInside1LastX128: BigNumber
  tokensOwed0: BigNumber
  tokensOwed1: BigNumber
}
const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS =
  '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'
const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000

// Transactions
const MAX_FEE_PER_GAS = '100000000000'
const MAX_PRIORITY_FEE_PER_GAS = '100000000000'
//const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 1000000000000

enum TransactionState {
    Failed = 'Failed',
    New = 'New',
    Rejected = 'Rejected',
    Sending = 'Sending',
    Sent = 'Sent',
}
const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am")
const localProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
//const localProvider = new ethers.providers.JsonRpcProvider('https://virtual.mainnet.eu.rpc.tenderly.co/788e8993-30e7-40ea-8442-f5b91c13efd0')
const walletInfo =  {
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey:
      'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
}

function createWallet(): ethers.Wallet {
    let provider = mainnetProvider
    provider = localProvider
    return new ethers.Wallet(walletInfo.privateKey, provider)
}

const wallet = createWallet()
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

async function mintPosition(): Promise<TransactionState> {
    const address = wallet.address
    const provider = getProvider()
    if (!address || !provider) {
        return TransactionState.Failed
    }
    const tokenInApproval = await getTokenTransferApproval(tokens.token0)
    console.log('tokenInApproval=', tokenInApproval)
    const tokenOutApproval = await getTokenTransferApproval(tokens.token1)
    console.log('tokenOutApproval=', tokenOutApproval)
    // Fail if transfer approvals do not go through
    if (tokenInApproval !== TransactionState.Sent || tokenOutApproval !== TransactionState.Sent) {
        return TransactionState.Failed
    }

    
    const positionToMint = await constructPosition(
        CurrencyAmount.fromRawAmount(
          tokens.token0,
          fromReadableAmount(
            tokens.token0Amount,
            tokens.token0.decimals
          )
        ),
        CurrencyAmount.fromRawAmount(
          tokens.token1,
          fromReadableAmount(
            tokens.token1Amount,
            tokens.token1.decimals
          )
        )
      )
      positionToMint.amount0
      positionToMint.amount1

      const mintOptions: MintOptions = {
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        slippageTolerance: new Percent(50, 10_000),
      }

      // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    positionToMint,
    mintOptions
  )

  console.log('calldata:', calldata)

  // build transaction
  const transaction = {
    data: calldata,
    to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
    value: value,
    from: address,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  }

  return sendTransaction(transaction)
  //return TransactionState.Sent

}

async function getTokenTransferApproval(token: Token): Promise<TransactionState> {
    const address = wallet.address
    const provider = getProvider()
    if (!provider || !address) {
        console.log('No Provider Found')
        return TransactionState.Failed
    }
    try {
        const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider)
        const transaction = await tokenContract.populateTransaction.approve(
            NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
            fromReadableAmount(
              TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
              token.decimals
            ).toString()
        )
        return sendTransaction({...transaction, from: address})
    } catch (err) {
        console.error(err)
        return TransactionState.Failed
    }
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
async function getPoolInfo(): Promise<PoolInfo> {
    const provider = getProvider()
    if (!provider) {
        throw new Error('No provider')
    }
    const currentPoolAddress = computePoolAddress({
        factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
        tokenA: tokens.token0,
        tokenB: tokens.token1,
        fee: tokens.poolFee,
    })
    console.log('currentPoolAddress=', currentPoolAddress)
    const poolContract = new ethers.Contract(
        currentPoolAddress,
        IUniswapV3PoolABI.abi,
        provider
      )
    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ])
  
    return {
      token0,
      token1,
      fee,
      tickSpacing,
      liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    }

}

async function constructPosition(
    token0Amount: CurrencyAmount<Token>,
    token1Amount: CurrencyAmount<Token>
  ): Promise<Position> {
    const poolInfo = await getPoolInfo()
    // construct pool instance
    console.log('token0Amount.quotient=', token0Amount.quotient.toString())
    console.log('token1Amount.quotient=', token1Amount.quotient.toString())
    const configuredPool = new Pool(
        token0Amount.currency,
        token1Amount.currency,
        poolInfo.fee,
        poolInfo.sqrtPriceX96.toString(),
        poolInfo.liquidity.toString(),
        poolInfo.tick
    )
    return Position.fromAmounts({
        pool: configuredPool,
        tickLower:
          nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) -
          poolInfo.tickSpacing * 100,
        tickUpper:
          nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) +
          poolInfo.tickSpacing * 100,
        amount0: token0Amount.quotient,
        amount1: token1Amount.quotient,
        useFullPrecision: true,
      })
  }

  export async function getPositionIds(): Promise<number[]> {
    const provider = getProvider()
    const address = wallet.address
    if (!provider || !address) {
      throw new Error('No provider available')
    }
  
    const positionContract = new ethers.Contract(
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      NONFUNGIBLE_POSITION_MANAGER_ABI,
      provider
    )
  
    // Get number of positions
    const balance: number = await positionContract.balanceOf(address)
  
    // Get all positions
    const tokenIds = []
    for (let i = 0; i < balance; i++) {
      const tokenOfOwnerByIndex: number =
        await positionContract.tokenOfOwnerByIndex(address, i)
      tokenIds.push(tokenOfOwnerByIndex)
    }
  
    return tokenIds
  }

  async function getPositionInfo(tokenId: number): Promise<PositionInfo> {
    const provider = getProvider()
    if (!provider) {
      throw new Error('No provider available')
    }
  
    const positionContract = new ethers.Contract(
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      NONFUNGIBLE_POSITION_MANAGER_ABI,
      provider
    )
  
    const position = await positionContract.positions(tokenId)
  
    return {
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      liquidity: position.liquidity.toString(),
      feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
      feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
      tokensOwed0: position.tokensOwed0.toString(),
      tokensOwed1: position.tokensOwed1.toString(),
    }
  }

  async function addLiquidity(positionId: number): Promise<TransactionState> {
    const address = wallet.address
    const provider = getProvider()
    if (!address || !provider) {
      return TransactionState.Failed
    }
  
    const positionToIncreaseBy = await constructPosition(
      CurrencyAmount.fromRawAmount(
        tokens.token0,
        fromReadableAmount(
          (tokens.token0Amount * tokens.fractionToAdd),
          tokens.token0.decimals
        )
      ),
      CurrencyAmount.fromRawAmount(
        tokens.token1,
        fromReadableAmount(
          (tokens.token1Amount * tokens.fractionToAdd),
          tokens.token1.decimals
        )
      )
    )

    const addLiquidityOptions: AddLiquidityOptions = {
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      slippageTolerance: new Percent(50, 10_000),
      tokenId: positionId,
    }
     // get calldata for increasing a position
    const { calldata, value } = NonfungiblePositionManager.addCallParameters(
      positionToIncreaseBy,
      addLiquidityOptions
    )

    // build transaction
    const transaction = {
      data: calldata,
      to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      value: value,
      from: address,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }

    await sendTransaction(transaction)
    return TransactionState.Sent
  }

  async function removeLiquidity(positionId: number): Promise<TransactionState> {
    const address = wallet.address
    const provider = getProvider()
    if (!address || !provider) {
      return TransactionState.Failed
    }
  
    const currentPosition = await constructPosition(
      CurrencyAmount.fromRawAmount(
        tokens.token0,
        fromReadableAmount(
          tokens.token0Amount,
          tokens.token0.decimals
        )
      ),
      CurrencyAmount.fromRawAmount(
        tokens.token1,
        fromReadableAmount(
          tokens.token1Amount,
          tokens.token1.decimals
        )
      )
    )

    const collectOptions: Omit<CollectOptions, 'tokenId'> = {
      expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(DAI_TOKEN, 0),
      expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(USDC_TOKEN, 0),
      recipient: address,
    }
    const removeLiquidityOptions: RemoveLiquidityOptions = {
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,
      slippageTolerance: new Percent(50, 10_000),
      tokenId: positionId,
      // percentage of liquidity to remove
      liquidityPercentage: new Percent(tokens.fractionToRemove),
      collectOptions,
    }
    // get calldata for minting a position
    const { calldata, value } = NonfungiblePositionManager.removeCallParameters(
      currentPosition,
      removeLiquidityOptions
    )
  
    // build transaction
    const transaction = {
      data: calldata,
      to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      value: value,
      from: address,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }
  
    await sendTransaction(transaction)
    return TransactionState.Sent
  }

  async function collectFees(positionId: number): Promise<TransactionState> {
    const address = wallet.address
    const provider = getProvider()
    if (!address || !provider) {
      return TransactionState.Failed
    }
    const collectOptions: CollectOptions = {
      tokenId: positionId,
      expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
        tokens.token0,
        fromReadableAmount(
          tokens.token0AmountToCollect,
          tokens.token0.decimals
        )
      ),
      expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
        tokens.token1,
        fromReadableAmount(
          tokens.token1AmountToCollect,
          tokens.token1.decimals
        )
      ),
      recipient: address,
    }

    const { calldata, value } =
    NonfungiblePositionManager.collectCallParameters(collectOptions)

    // build transaction
    const transaction = {
      data: calldata,
      to: NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS,
      value: value,
      from: address,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    }

    return sendTransaction(transaction)
  }

  async function main() {
    //await mintPosition()
    const positionIds = await getPositionIds()
    //await addLiquidity(positionIds[positionIds.length - 1])
    //await removeLiquidity(positionIds[positionIds.length - 1])
    await collectFees(positionIds[positionIds.length - 1])
    for (let id of positionIds) {
      const positionInfo = await getPositionInfo(id)
      console.log('=====position id:', id.toString(), '===========')
      console.log(positionInfo)
    }
  }

  main().then().catch((e) => {
    console.log(e)
  })


  //npx hardhat run scripts\mint-position.ts