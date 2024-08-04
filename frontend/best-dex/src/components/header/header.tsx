"use client"

import React from 'react'
import NetworkWrapper from '../network/NetworkWrapper'
import WalletWrapper from '../wallet/WalletWrapper'
import Burger from './Burger'

type HeaderProps = {}

const Header:React.FC<HeaderProps> = () => {

  return (
    <div className='w-full sticky top-0 bg-black z-50 shadow-gray-300'>
      <div className='h-16 flex justify-end items-center'>
          <NetworkWrapper/>
          <WalletWrapper/>
          <Burger/>   
      </div>
    </div>
  )
}

export default Header