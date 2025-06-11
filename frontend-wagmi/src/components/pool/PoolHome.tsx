'use client'

import { useSwitchChain } from 'wagmi'
import { IContextUtil, useContextUtil } from '../providers/ContextUtilProvider'

type PoolHomeProps = {}
const PoolHome: React.FC<PoolHomeProps> = () => {;
    const { chains, switchChain } = useSwitchChain()
    const {getCurrentPath} = useContextUtil() as IContextUtil
 
    return (
        <div>
            <div className='font-semibold text-xl my-10 md:hidden capitalize'>{getCurrentPath()}</div>
            <div className='bg-zinc-900 w-full md:w-[500px] h-80 rounded-xl md:mt-10 mx-auto p-10'>
                
            </div>    
        </div>
    )
}

export default PoolHome