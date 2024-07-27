"use client"

import React, { useState } from 'react'
import MobileMenu from '../menu/mobile-menu'

type BurgerProps = {}
const Burger: React.FC<BurgerProps> = () => {
    const [show, setShow] = useState<boolean>(false)

    const handleClick = () => {
        setShow(true)
    }

  return (
    <div>
        <div className='ml-3 2 cursor-pointer w-[32px] h-[32px] 
            rounded-full justify-center items-center hover:bg-zinc-500 active:bg-zinc-400
            hidden max-md:flex'>
            <div className='w-[20px] h-[15px] flex-col 
            justify-between flex'
            onClick={handleClick}>
                <span className='w-[20px] h-[2px] bg-zinc-300 block'></span>
                <span className='w-[20px] h-[2px] bg-zinc-300 block'></span>
                <span className='w-[20px] h-[2px] bg-zinc-300 block'></span>
            </div>
        </div>
        <MobileMenu show={show} setShow={setShow}/>
    </div>
    
  )
}

export default Burger