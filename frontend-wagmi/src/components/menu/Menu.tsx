'use client'

import { useState } from "react"

const Menu: React.FC<{}> = () => {
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
        <div className={`bg-zinc-800 h-screen w-[200px] sticky top-0 max-md:hidden group ${animation}`}>
            <div className="flex flex-col h-full relative">
                <div className='absolute w-6 h-14 rounded-md 
                        border border-zinc-300 -right-3 top-5 
                        bg-black cursor-pointer
                        flex items-center justify-center invisible
                        group-hover:visible'>
                    <img className={`cursor-pointer ${isMin ? 'rotate-180' : ''}`}
                        src="/imgs/left-arrow.svg" 
                        alt="toggle menu" onClick={onClick}/>
                        </div>
                <div className="h-[120px]">
                </div>
                <div className="grow bg-red-200 w-full">
                </div>
                <div className="h-[80px] bg-lime-500">

                </div>
            </div>
        </div>
    )
}

export default Menu