"use client"
import React, { useState } from 'react'
import StandardMenu from './StandardMenu'
import MinMenu from './MinMenu'

type MenuHomeProps = {}
const MenuHome: React.FC<MenuHomeProps> = () => {
  const [isMin, setIsMin] = useState<boolean>(false)
  const [animation, setAnimation] = useState<string>('')

  const onClick = () => {
    if (isMin) {
      setAnimation('animate-arrow-flip-left') 
    } else {
      setAnimation('animate-arrow-flip-right')
    }
    setIsMin(isMin => !isMin)
  }

  return (
    <div className={`h-screen bg-zinc-800 border-r border-zinc-500 group max-md:hidden sticky top-0`}>
        <div className='absolute w-6 h-14 rounded-md 
            border border-zinc-500 -right-3 top-5 
            bg-black cursor-pointer
            flex items-center justify-center
            hover:border-zinc-300 invisible
            group-hover:visible'
            >
              <img className={`${animation} ${isMin ? 'rotate-180' : ''} cursor-pointer`}
                src="/imgs/left-arrow.svg" 
                alt="toggle menu" onClick={onClick}/>
        </div>
        <StandardMenu hidden={isMin}/>
        <MinMenu hidden={!isMin}/>
    </div>
  )
}

export default MenuHome