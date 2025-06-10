'use client'

import { useSwitchChain } from 'wagmi'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()

    return (
        <div>
        </div>
    )
}

export default SwapHome