'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { IContextUtil, useContextUtil } from '../providers/ContextUtilProvider'
import NetworkOption from '../common/NetworkOption'
import { useState } from 'react'

type SwapHomeProps = {}
const SwapHome: React.FC<SwapHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()
    const chainId = useChainId()
    const curChain = chains.filter((c) => c.id === chainId)[0]
    const {getCurrentPath} = useContextUtil() as IContextUtil
    const [networkOpen, setNetworkOpen] = useState(false)

    const onOpenChange = (open: boolean) => {
        setNetworkOpen(open)
    }

    const handleSwitchNetwork = (id: number)=> {
        setNetworkOpen(false)
        switchChain({chainId: id})
    }
    
    return (
        <div>
            <div className='font-semibold text-xl my-10 md:hidden capitalize'>{getCurrentPath()}</div>
            <div className='bg-zinc-900 w-full md:w-[500px] h-96 rounded-xl md:mt-10 mx-auto p-10'>
                    <NetworkOption 
                        networkOpen={networkOpen} 
                        curChain={curChain} 
                        chains={chains} 
                        onOpenChange={onOpenChange} 
                        handleSwitchNetwork={handleSwitchNetwork}/>
            </div>    
        </div>
    )
}

export default SwapHome