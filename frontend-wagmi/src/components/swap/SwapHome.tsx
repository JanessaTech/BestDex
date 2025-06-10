'use client'

import { useSwitchChain } from 'wagmi'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()

    return (
        <div className='bg-zinc-900 w-full md:w-[500px] h-80 rounded-xl mx-auto mt-20 p-10'>
        </div>
    )
}

export default SwapHome