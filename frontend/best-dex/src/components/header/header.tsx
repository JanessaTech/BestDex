"use client"

import React from 'react'
import Burger from './burger'
import MenuWrapper from './menuWrapper'
import NetworkWrapper from './networkWrapper'

type HeaderProps = {}

const Header:React.FC<HeaderProps> = () => {
  return (
    <div className='w-full'>
      <div className='h-16 flex justify-end items-center'>
          <NetworkWrapper/>
          <MenuWrapper/>
          <Burger/>   
      </div>
    </div>
  )
}

export default Header