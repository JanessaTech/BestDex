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
                                <div className="group-hover/li:bg-zinc-700 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname === '/' ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <svg 
                                            className="w-6 h-6"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" viewBox="0 0 24 24"
                                            strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                        </svg>
                                        <span className={`${isMin ? 'hidden' : ''} px-2`}>Swap</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        <Link href='/pool'>
                            <li className="group/li"  onClick={setShow ? () => setShow(false): () => {}}>
                                <div className="group-hover/li:bg-zinc-700 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname.startsWith('/pool') ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <svg 
                                            className="w-6 h-6"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" viewBox="0 0 24 24" 
                                            strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                        </svg>
                                        <span className={`${isMin ? 'hidden' : ''} px-2`}>Pool</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        <Link href='/explore'>
                            <li className="group/li"  onClick={setShow ? () => setShow(false): () => {}}>
                                <div className="group-hover/li:bg-zinc-700 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname.startsWith('/explore') ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <svg 
                                            className="w-6 h-6"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" viewBox="0 0 24 24" 
                                            strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        <span className={`${isMin ? 'hidden' : ''} px-2`}>Explore</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        <Link href='/balance'>
                            <li className="group/li"  onClick={setShow ? () => setShow(false): () => {}}>
                                <div className="group-hover/li:bg-zinc-700 py-2">
                                    <div className={`flex items-center ml-3 border-r-2  
                                        ${pathname.startsWith('/balance') ? 'text-pink-600 border-pink-600' : 'border-zinc-800'}`}>
                                        <svg 
                                            className="w-6 h-6"
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" viewBox="0 0 24 24" strokeWidth="1.5" 
                                            stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <span className={`${isMin ? 'hidden' : ''} px-2`}>Balance</span>
                                    </div>
                                </div>  
                            </li>
                        </Link>
                        
                    </ul>
    )
}

export default Menu