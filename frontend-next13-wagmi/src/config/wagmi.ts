import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig , Chain} from '@rainbow-me/rainbowkit';
import {
    mainnet,
    polygon,
    arbitrum,
    base,
    sepolia,
    hardhat
  } from 'wagmi/chains';
  import {http } from "wagmi";
  import {
    walletConnectWallet,
    okxWallet,
    uniswapWallet,
    trustWallet
  } from '@rainbow-me/rainbowkit/wallets';
  
  export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
  
  if (!projectId) {
    throw new Error('Project ID is not defined')
  }

  // define chains with custom icons
  const chains: readonly [Chain, ...Chain[]] = [
    {
      ...mainnet,
      iconUrl: '/imgs/networks/ethereum.png',
    },
    {
      ...polygon,
      iconUrl: '/imgs/networks/polygon.png',
    },
    {
      ...arbitrum,
      iconUrl: '/imgs/networks/arbitrumone.png',
    },
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [{...sepolia, iconUrl: '/imgs/networks/sepolia.png'}, 
                                                              {...hardhat, iconUrl: '/imgs/networks/hardhat.png', contracts: {multicall3: {address: '0xca11bde05977b3631167028862be2a173976ca11' as `0x${string}`, blockCreated: 14353601}}}] 
                                                           : [])
  ]
/*
export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: projectId,
  wallets: [{
    groupName: 'Recommended',
    wallets: [walletConnectWallet,okxWallet,uniswapWallet,trustWallet],
  }],
  chains,
  transports: {
    // RPC URL for each chain
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
    [polygon.id]: http(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    [arbitrum.id]: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    [hardhat.id]: http('http://127.0.0.1:8545')
  },
  ssr: true
}); */
export const chainUrls = { // it should be consistent with the variable chains defined above
  [mainnet.id]: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  [polygon.id]: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  [arbitrum.id]: `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  [sepolia.id]: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  [hardhat.id]: 'http://127.0.0.1:8545'
}
export const myTransports = Object.fromEntries(
  Object.entries(chainUrls).map(([chainId, url]) => [chainId, http(url)])
);
export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: projectId,
  wallets: [{
    groupName: 'Recommended',
    wallets: [walletConnectWallet,okxWallet,uniswapWallet,trustWallet],
  }],
  chains,
  transports: myTransports,
  ssr: true
});