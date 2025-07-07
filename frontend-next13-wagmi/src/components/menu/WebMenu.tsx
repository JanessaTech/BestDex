'use client'

import Link from "next/link"
import { useState } from "react"
import Menu from "./Menu"

const WebMenu: React.FC<{}> = () => {
    const [isMin, setIsMin] = useState<boolean>(false)
    const [animation, setAnimation] = useState<string>('')
    
    const onClick = () => {
        if (isMin) {
        setAnimation('animate-move-right') 
        } else {
        setAnimation('animate-move-left')
        }
        setIsMin(isMin => !isMin)
    }

    return (
        <div className={`bg-zinc-900 h-screen w-[200px] border-r border-zinc-500 sticky top-0 text-sm max-md:hidden group ${animation}`} >
            <div className="flex flex-col h-full relative">
                <div className='absolute w-6 h-7 rounded-md 
                        border border-zinc-300 -right-3 top-20 
                        bg-black cursor-pointer
                        flex items-center justify-center invisible
                        group-hover:visible'>
                    <img className={`cursor-pointer ${isMin ? 'rotate-180' : ''}`}
                        src="/imgs/left-arrow.svg" 
                        alt="toggle menu" onClick={onClick}/>
                        </div>
                <div className="h-[120px] relative">
                    <img src="/imgs/logo.svg" alt="best DEX" 
                    width={50}
                    height={50}
                    className='absolute top-6 left-3 '
                    />
                    <span className={`absolute top-14 left-11 text-2xl font-extrabold italic ${isMin ? 'hidden' : ''}`}>BEST DEX</span>
                </div>
                <div className="grow">
                    <Menu isMin={isMin}/>
                </div>
                <div className='h-[80px] flex items-center justify-center cursor-pointer border-t border-zinc-500'>
                <Link href='https://consensys.io/terms-of-use' 
                     target='_blank' 
                        rel="noopener noreferrer" className='mx-2'>Term of use</Link>
                </div>
            </div>
        </div>
    )
}

export default WebMenu