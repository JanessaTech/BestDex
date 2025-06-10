'use client'

import {
    useConnectModal,
    useChainModal,
  } from '@rainbow-me/rainbowkit';
import { useChains } from 'wagmi';
import { useSwitchChain } from 'wagmi'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {
    const { openChainModal } = useChainModal();
    const { openConnectModal } = useConnectModal();
    const { chains, switchChain } = useSwitchChain()
    // for (let chain of chains) {
    //   console.log('chain name:', chain.name, ' chain id: ', chain.id)
    // }
    
    return (
        <div>
           {openChainModal && (
            <button onClick={openChainModal} type="button">
            Open Chain Modal
            </button>
            )}
            {openConnectModal && (
          <button onClick={openConnectModal} type="button">
            Open Connect Modal
          </button>
            )}
            <div>
          {chains.map((chain) => (
            <div>
              <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
              {chain.name}
            </button>
            </div>
          ))}
    </div>
            
        </div>
    )
}

export default SwapHome