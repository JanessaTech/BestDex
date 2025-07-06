'use client'

import React, { useCallback, useEffect, useState } from 'react'
import './routing.css'
import { Environment, CurrentConfig } from './lib/config'
import { getCurrencyBalance, wrapETH } from './lib/wallet'
import {
  getProvider,
  getWalletAddress,
  TransactionState,
} from './lib/providers'

const useOnBlockUpdated = (callback: (blockNumber: number) => void) => {
  useEffect(() => {
    const subscription = getProvider()?.on('block', callback)
    return () => {
      subscription?.removeAllListeners()
    }
  })
}

const Example = () => {
  const [tokenInBalance, setTokenInBalance] = useState<string>()
  const [tokenOutBalance, setTokenOutBalance] = useState<string>()
  const [txState, setTxState] = useState<TransactionState>(TransactionState.New)
  const [blockNumber, setBlockNumber] = useState<number>(0)

  // Listen for new blocks and update the wallet
  useOnBlockUpdated(async (blockNumber: number) => {
    refreshBalances()
    setBlockNumber(blockNumber)
  })

  // Update wallet state given a block number
  const refreshBalances = useCallback(async () => {
    const provider = getProvider()
    const address = getWalletAddress()
    if (!address || !provider) {
      return
    }

    setTokenInBalance(
      await getCurrencyBalance(provider, address, CurrentConfig.tokens.in)
    )
    setTokenOutBalance(
      await getCurrencyBalance(provider, address, CurrentConfig.tokens.out)
    )
  }, [])

  // Event Handlers

  const onConnectWallet = useCallback(async () => {
  }, [refreshBalances])

  const executeSwap = async () => {
    //setTxState(TransactionState.Sending)
    console.log('executeSwap...')
    const response = await fetch('/api/nonce');
    const res = await response.json()
    console.log(res)
  }
  // const executeSwap = useCallback(async (route: SwapRoute | null) => {
  //   if (!route) {
  //     return
  //   }
  //   setTxState(TransactionState.Sending)
  //   setTxState(await executeRoute(route))
  // }, [])

  return (
    <div className="App">
      {CurrentConfig.rpc.mainnet === '' && (
        <h2 className="error">Please set your mainnet RPC URL in config.ts</h2>
      )}
      {CurrentConfig.env === Environment.WALLET_EXTENSION &&
        getProvider() === null && (
          <h2 className="error">
            Please install a wallet to use this example configuration
          </h2>
        )}
      <h3>{`Wallet Address: ${getWalletAddress()}`}</h3>
      {CurrentConfig.env === Environment.WALLET_EXTENSION &&
        !getWalletAddress() && (
          <button onClick={onConnectWallet}>Connect Wallet</button>
        )}
      <h3>{`Block Number: ${blockNumber + 1}`}</h3>
      <h3>{`Transaction State: ${txState}`}</h3>
      <h3>{`Token In (${CurrentConfig.tokens.in.symbol}) Balance: ${tokenInBalance}`}</h3>
      <h3>{`Token Out (${CurrentConfig.tokens.out.symbol}) Balance: ${tokenOutBalance}`}</h3>
      <button
        onClick={() => wrapETH(100)}
        disabled={getProvider() === null || CurrentConfig.rpc.mainnet === ''}>
        <p>Wrap ETH</p>
      </button>
      <button className='bg-green-500 px-2 py-1 rounded-md active:bg-green-600'
        onClick={() => executeSwap()}
        disabled={
          txState === TransactionState.Sending ||
          getProvider() === null ||
          CurrentConfig.rpc.mainnet === ''
        }>
        <p>Swap Using Route</p>
      </button>
    </div>
  )
}

export default Example