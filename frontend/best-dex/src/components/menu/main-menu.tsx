"use client"
import React, { useState } from 'react'
import StandardMenu from './standard-menu'
import MinMenu from './min-menu'

const MainMenu = () => {
  const [isMin, setIsMin] = useState<boolean>(false)
  const [animation, setAnimation] = useState<string>('')

  const onClick = () => {
    if (isMin) {
      setAnimation('animate-arrow-flip-left') 
    } else {
      console.log('animate-arrow-flip-to-right')
      setAnimation('animate-arrow-flip-right')
    }
    setIsMin(isMin => !isMin)
  }

  return (
    <div className={`h-screen bg-zinc-800 relative border-r border-zinc-500 group`}>
        <div className='absolute w-6 h-6 rounded-md 
            border border-zinc-500 -right-3 top-5 
            bg-black cursor-pointer
            flex items-center justify-center
            hover:border-zinc-300 invisible
            group-hover:visible'
            onClick={onClick}
            >
              <img className={`${animation} ${isMin ? 'rotate-180' : ''}`}
                src="/imgs/left-arrow.svg" 
                alt="toggle menu"/>
        </div>
        <StandardMenu hidden={isMin}/>
        <MinMenu hidden={!isMin}/>
    </div>
  )
}

export default MainMenu