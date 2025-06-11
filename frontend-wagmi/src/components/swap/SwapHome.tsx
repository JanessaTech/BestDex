'use client'

import { useSwitchChain } from 'wagmi'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()

    return (
        <div>
            <div className='font-semibold text-xl my-10 md:hidden'>Swap</div>
            <div className='bg-zinc-900 w-full md:w-[500px] h-80 rounded-xl md:mt-10 mx-auto p-10'>
            </div>    
        </div>
    )
}

export default SwapHome