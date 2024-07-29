import Balance from '@/lib/svgs/balance'
import Explore from '@/lib/svgs/explore'
import Pool from '@/lib/svgs/pool'
import Swap from '@/lib/svgs/swap'
import Link from 'next/link'
import React from 'react'

type StandardMenuProps = {
    hidden: boolean
}

const StandardMenu: React.FC<StandardMenuProps>  = ({hidden}) => {
  return (
    <div className={`w-[200px] ${hidden ? 'hidden' : ''} flex min-h-screen`}>
      <div className='flex flex-col w-full'>
        <div className='h-[120px] relative'>
          <img src="/imgs/logo.svg" alt="best DEX" 
            width={50}
            height={50}
            className='absolute top-6 left-3 '
          />
          <span className='absolute top-14 left-11 text-2xl font-extrabold italic'>BEST DEX</span>
        </div>
        <div className='flex-grow'>
          <ul className='ml-5 cursor-pointer'>
            <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
              <Swap className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
              <span className='ml-3 text-xl font-medium'>Swap</span>
            </li>
            <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
              <Pool className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
              <span className='ml-3 text-xl font-medium'>Pool</span>
            </li>
            <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
              <Explore className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
              <span className='ml-3 text-xl font-medium'>Explore</span>
            </li>
            <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
              <Balance className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
              <span className='ml-3 text-xl font-medium'>Balance</span>
            </li>
          </ul>

        </div>
        <div className='h-[80px] flex items-center justify-center cursor-pointer border-t border-zinc-500'>
          <Link href='https://consensys.io/terms-of-use' target='_blank' rel="noopener noreferrer">Term of use</Link>
        </div>
      </div>      
    </div>
  )
}

export default StandardMenu