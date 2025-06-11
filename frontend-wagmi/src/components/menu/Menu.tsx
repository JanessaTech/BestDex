import SVGPool from "@/lib/svgs/svg-pool";
import SVGSwap from "@/lib/svgs/svg-swap";
import SVGBalance from "@/lib/svgs/svg_balance";
import SVGExplore from "@/lib/svgs/svg_explore";
import Link from "next/link"
import { usePathname } from "next/navigation"

type MenuProps = {
    isMin: boolean;
    setShow?: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu:React.FC<MenuProps> = ({isMin, setShow}) => {
    const pathname = usePathname()

    return (
                    <ul className='cursor-pointer '>
                        <Link href='/' onClick={setShow ? () => setShow(false): () => {}}>
                            <li className="group/li">
                                <div className="group-hover/li:bg-zinc-700/50 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname === '/' ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <SVGSwap className="w-6 h-6"/>
                                        <span className={`${isMin ? 'hidden' : ''} px-2 truncate min-w-1`}>Swap</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        <Link href='/pool'>
                            <li className="group/li"  onClick={setShow ? () => setShow(false): () => {}}>
                                <div className="group-hover/li:bg-zinc-700/50 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname.startsWith('/pool') ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <SVGPool className="w-6 h-6"/>
                                        <span className={`${isMin ? 'hidden' : ''} px-2  truncate min-w-1`}>Pool</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        <Link href='/explore'>
                            <li className="group/li"  onClick={setShow ? () => setShow(false): () => {}}>
                                <div className="group-hover/li:bg-zinc-700/50 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname.startsWith('/explore') ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <SVGExplore className="w-6 h-6"/>
                                        <span className={`${isMin ? 'hidden' : ''} px-2 truncate min-w-1`}>Explore</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        <Link href='/balance'>
                            <li className="group/li"  onClick={setShow ? () => setShow(false): () => {}}>
                                <div className="group-hover/li:bg-zinc-700/50 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname.startsWith('/balance') ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <SVGBalance className="w-6 h-6"/>
                                        <span className={`${isMin ? 'hidden' : ''} px-2 truncate min-w-1`}>Balance</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        
                    </ul>
    )
}

export default Menu