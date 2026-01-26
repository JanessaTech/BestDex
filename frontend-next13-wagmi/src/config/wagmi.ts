import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig , Chain} from '@rainbow-me/rainbowkit';
import {
    mainnet,
    bsc,
    base,
    arbitrum,
    sepolia,
    baseSepolia,
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
      ...bsc,
      iconUrl: '/imgs/networks/bnbsmartchain.png',
    },
    {
      ...base,
      iconUrl: '/imgs/networks/base.png',
    },
    {
      ...arbitrum,
      iconUrl: '/imgs/networks/arbitrumone.png',
    },
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [{...sepolia, iconUrl: '/imgs/networks/sepolia.png'},
                                                              {...baseSepolia, iconUrl: '/imgs/networks/bnbsmartchaintestnet.png'}
                                                              ] 
                                                           : []),
    ...(process.env.NEXT_PUBLIC_ENABLE_LOCALS === 'true' ? [{...hardhat, iconUrl: '/imgs/networks/hardhat.png', contracts: {multicall3: {address: '0xca11bde05977b3631167028862be2a173976ca11' as `0x${string}`, blockCreated: 14353601}}}] : [])
  ]

const chainUrls = { // it should be consistent with the variable chains defined above
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  [bsc.id]: `https://bnb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  [baseSepolia.id]: `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
  [hardhat.id]: `${process.env.NEXT_PUBLIC_BACKEND_HARDHAT_ADDR}`
}
const myTransports = Object.fromEntries(
  Object.entries(chainUrls).map(([chainId, url]) => [chainId, http(url)])
);
export const config = getDefaultConfig({
  appName: 'Best DEX powered by JanessaTech',
  projectId: projectId,
  wallets: [{
    groupName: 'Recommended',
    wallets: [walletConnectWallet,okxWallet,uniswapWallet,trustWallet],
  }],
  chains,
  transports: myTransports,
  ssr: true
});