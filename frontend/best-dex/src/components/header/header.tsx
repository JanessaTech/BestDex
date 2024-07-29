"use client"

import React from 'react'
import Burger from './burger'
import NetworkWrapper from './networkWrapper'
import WalletWrapper from './walletWrapper'

type HeaderProps = {}

const Header:React.FC<HeaderProps> = () => {

  return (
    <div className='w-full'>
      <div className='h-16 flex justify-end items-center'>
          <NetworkWrapper/>
          <WalletWrapper/>
          <Burger/>   
      </div>
    </div>
  )
}

export default Header