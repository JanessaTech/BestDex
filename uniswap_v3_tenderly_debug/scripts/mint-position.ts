import { ethers, providers} from 'ethers'
import { FeeAmount } from '@uniswap/v3-sdk'
import {Token, ChainId } from '@uniswap/sdk-core'

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

const tokens =  {
    token0: USDC_TOKEN,
    token0Amount: 1000,
    token1: DAI_TOKEN,
    token1Amount: 1000,
    poolFee: FeeAmount.LOW,
}

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


async function mintPosition(): Promise<TransactionState> {
    const address = wallet.address
    const provider = getProvider()
    if (!address || !provider) {
        return TransactionState.Failed
    }


    return TransactionState.Sent
}

async function getTokenTransferApproval(token: Token): Promise<TransactionState> {
    const address = wallet.address
    const provider = getProvider()
    if (!provider || !address) {
        console.log('No Provider Found')
        return TransactionState.Failed
    }
    try {
        
    }
    return TransactionState.Sent
}