import React from 'react'
import Burger from './burger'

type HeaderProps = {}

const Header:React.FC<HeaderProps> = () => {

  return (
    <div className='w-full h-16 flex justify-end items-center'>
      <div>
        <button className='bg-sky-700 px-5 py-1.5 rounded-full 
                        hover:bg-sky-600 active:bg-sky-500 max-md:hidden'>Connect wallet</button>
        <Burger/>
      </div>
    </div>
  )
}

export default Header