import Link from "next/link"
import { MenuType } from "@/lib/types"
import { usePathname } from 'next/navigation'
import Swap from "@/lib/svgs/Swap"
import Pool from "@/lib/svgs/Pool"
import Explore from "@/lib/svgs/Explore"
import Balance from "@/lib/svgs/Balance"
import Logout from "@/lib/svgs/Logout"
import LogoutInMenu from "./LogoutInMenu"

type MenuProps = {
    menuType: MenuType,
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu: React.FC<MenuProps> = ({menuType, setShow}) => {
  const pathname = usePathname()

    return (
        <>
        <div className='flex flex-col w-full'>
          <div className='h-[120px] relative'>
            <img src="/imgs/logo.svg" alt="best DEX" 
              width={50}
              height={50}
              className='absolute top-6 left-3 '
            />
            <span className={`absolute top-14 left-11 text-2xl font-extrabold italic ${menuType as MenuType === MenuType.MinMenu ? 'hidden' : ''}`}>BEST DEX</span>
          </div>
          <div className='flex-grow'>
            <ul className='ml-5 cursor-pointer'>
              <Link href='/' onClick={() => setShow ? setShow(false) : () => {}}>
                <li className={`group/li flex items-center h-[30px] my-[10px] 
                ${pathname === '/' ? 'border-r-2 border-r-sky-500 text-sky-500' : ''}
                    hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500`}>
                  <Swap className={`h-[30px] w-[30px] 
                  ${pathname === '/' ? 'text-sky-500' : 'text-zinc-300'}
                    group-hover/li:text-sky-500`}/>
                  <div className={`ml-3 text-xl font-medium ${menuType as MenuType === MenuType.MinMenu ? 'hidden' : ''}`}>Swap</div>
                </li>
              </Link>
              <Link href='/pool' onClick={() => setShow ? setShow(false) : () => {}}>
                <li className={`group/li flex items-center h-[30px] my-[10px] 
                ${pathname.startsWith('/pool') ? 'border-r-2 border-r-sky-500 text-sky-500': ''}
                    hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500`}>
                  <Pool className={`h-[30px] w-[30px] 
                  ${pathname.startsWith('/pool') ? 'text-sky-500' : 'text-zinc-300'}
                    group-hover/li:text-sky-500`}/>
                  <div className={`ml-3 text-xl font-medium ${menuType as MenuType === MenuType.MinMenu ? 'hidden' : ''}`}>Pool</div>
                </li>
              </Link>
              <Link href='/explore' onClick={() => setShow ? setShow(false) : () => {}}>
                <li className={`group/li flex items-center h-[30px] my-[10px] 
                ${pathname.startsWith('/explore') ? 'border-r-2 border-r-sky-500 text-sky-500': ''}
                    hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500`}>
                  <Explore className={`h-[30px] w-[30px]  
                  ${pathname.startsWith('/explore') ? 'text-sky-500' : 'text-zinc-300'}
                    group-hover/li:text-sky-500`}/>
                  <div className={`ml-3 text-xl font-medium ${menuType as MenuType === MenuType.MinMenu ? 'hidden' : ''}`}>Explore</div>
                </li>
              </Link>
              <Link href='/balance' onClick={() => setShow ? setShow(false) : () => {}}>
                <li className={`group/li flex items-center h-[30px] my-[10px] 
                ${pathname.startsWith('/balance') ? 'border-r-2 border-r-sky-500 text-sky-500': ''}
                  hover:border-r-2 hover:border-r-sky-500 hover:text-sky-500`}>
                  <Balance className={`h-[30px] w-[30px] ${pathname.startsWith('/balance') ? 'text-sky-500' : 'text-zinc-300'}
                    group-hover/li:text-sky-500`}/>
                  <div className={`ml-3 text-xl font-medium ${menuType as MenuType === MenuType.MinMenu ? 'hidden' : ''}`}>Balance</div>
                </li>
              </Link>
              <LogoutInMenu menuType={menuType}/>
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