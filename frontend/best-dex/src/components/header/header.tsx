"use client"

import React from 'react'
import NetworkWrapper from './NetworkWrapper'
import WalletWrapper from './WalletWrapper'
import Burger from './Burger'

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