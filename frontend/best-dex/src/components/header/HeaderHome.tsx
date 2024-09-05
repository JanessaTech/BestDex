"use client"

import React from 'react'
import NetworkWrapper from '../network/NetworkWrapper'
import WalletWrapper from '../wallet/WalletWrapper'
import Burger from './Burger'
import { AuthState, authState } from '@/lib/atoms'
import { useRecoilState } from 'recoil'
import Profile from './Profile'

type HeaderProps = {}

const HeaderHome:React.FC<HeaderProps> = () => {
  const [auth, setAuth] = useRecoilState<AuthState>(authState)

  return (
    <div className='w-full sticky top-0 bg-black z-50 shadow-gray-300'>
      <div className='h-16 flex justify-end items-center'>
          <NetworkWrapper/>
          {!auth?.loginedUser && <WalletWrapper/>}
          {!!auth?.loginedUser && <Profile loginedUser={auth.loginedUser}/>}
          <Burger/>   
      </div>
    </div>
  )
}

export default HeaderHome