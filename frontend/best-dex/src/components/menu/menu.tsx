import Balance from "@/lib/svgs/balance"
import Explore from "@/lib/svgs/explore"
import Pool from "@/lib/svgs/pool"
import Swap from "@/lib/svgs/swap"
import Link from "next/link"

type MenuProps = {
    isMin: boolean
}

const Menu: React.FC<MenuProps> = ({isMin}) => {
    return (
        <>
        <div className='flex flex-col w-full'>
          <div className='h-[120px] relative'>
            <img src="/imgs/logo.svg" alt="best DEX" 
              width={50}
              height={50}
              className='absolute top-6 left-3 '
            />
            <span className={`absolute top-14 left-11 text-2xl font-extrabold italic ${isMin ? 'hidden' : ''}`}>BEST DEX</span>
          </div>
          <div className='flex-grow'>
            <ul className='ml-5 cursor-pointer'>
              <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
                <Swap className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
                <div className={`ml-3 text-xl font-medium ${isMin ? 'hidden' : ''}`}>Swap</div>
              </li>
              <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
                <Pool className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
                <div className={`ml-3 text-xl font-medium ${isMin ? 'hidden' : ''}`}>Pool</div>
              </li>
              <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
                <Explore className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
                <div className={`ml-3 text-xl font-medium ${isMin ? 'hidden' : ''}`}>Explore</div>
              </li>
              <li className='group/li flex items-center h-[30px] my-[10px] hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500'>
                <Balance className='h-[30px] w-[30px] text-zinc-300 group-hover/li:text-sky-500'/>
                <div className={`ml-3 text-xl font-medium ${isMin ? 'hidden' : ''}`}>Balance</div>
              </li>
            </ul>
  
          </div>
          <div className='h-[80px] flex items-center justify-center cursor-pointer border-t border-zinc-500'>
            <Link href='https://consensys.io/terms-of-use' 
              target='_blank' 
              rel="noopener noreferrer" className='mx-2'>Term of use</Link>
          </div>
        </div> 
        </>
    )
}

export default Menu