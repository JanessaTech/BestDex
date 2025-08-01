import { ethers, providers, BigNumber } from 'ethers'
import { Environment, CurrentConfig } from './config'
import { BaseProvider } from '@ethersproject/providers'

// Single copies of provider and wallet
const mainnetProvider = new ethers.providers.JsonRpcProvider(
  CurrentConfig.rpc.mainnet
)
const wallet = createWallet()

let walletExtensionAddress: string | null = null

// Interfaces

export enum TransactionState {
  Failed = 'Failed',
  New = 'New',
  Rejected = 'Rejected',
  Sending = 'Sending',
  Sent = 'Sent',
}

// Provider and Wallet Functions

export function getMainnetProvider(): BaseProvider {
  return mainnetProvider
}

export function getProvider(): providers.Provider | null {
  return wallet.provider
}

export function getWalletAddress(): string | null {
  return CurrentConfig.env === Environment.WALLET_EXTENSION
    ? walletExtensionAddress
    : wallet.address
}

export async function sendTransaction(
  transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  return sendTransactionViaWallet(transaction)
}

// Internal Functionality

function createWallet(): ethers.Wallet {
  let provider = mainnetProvider
  if (CurrentConfig.env == Environment.LOCAL) {
    provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.local)
  }
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider)
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