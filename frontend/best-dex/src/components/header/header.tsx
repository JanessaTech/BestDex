import React from 'react'
import Burger from './burger'

type HeaderProps = {}

const Header:React.FC<HeaderProps> = () => {

  return (
    <div className='w-full h-16 flex justify-end items-center'>
      <Burger/>
      
    </div>
  )
}

export default Header