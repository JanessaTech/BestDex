"use client"

import React, {useState } from 'react'
import Burger from './burger'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import useOutsideClick from '@/hooks/useOutsideClick'
import useMediaQuery from '@/hooks/useMediaQuery'
import WalletConnect from '../wallet/walletConnect'

type HeaderProps = {}

const Header:React.FC<HeaderProps> = () => {
  const [openPopover, setOpenPopover] = useState(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('popover', false.toString())
    } 
    return false
  })
  const [openDrawer, setOpendrawer] = useState(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drawer', false.toString())
    }
    return false
  })

  const updatePopover = (status: boolean) => {
    setOpenPopover(status)
    localStorage.setItem('popover', status.toString())
  }

  const updateDrawer = (status: boolean) => {
    setOpendrawer(status)
    localStorage.setItem('drawer', status.toString())
  }

  const outSideClickCallback = () => {
    console.log('handle outSideClickCallback...')
    updateDrawer(false)
  }

  const ref = useOutsideClick(outSideClickCallback)  // custom outsideClick hook

  const mediaQueryCallback = () => {
      console.log('handle mediaQueryCallback...')
      if (window.innerWidth <= 768) {
        const _openPopover = localStorage.getItem('popover') === 'true'
        if (_openPopover) {
          updatePopover(false)
          updateDrawer(true)
        }
      } else {
        const _openDrawer = localStorage.getItem('drawer') === 'true'
        if (_openDrawer) {
          updatePopover(true)
          updateDrawer(false)
        }
      }
  }
  useMediaQuery(mediaQueryCallback) // custom mediaQuery hook

  const onOpenChange = (open: boolean) => {
    console.log('onOpenChange is triggered. open=', open)
    updatePopover(open)
  }

  const handlePopoverClick = () => {
    updatePopover(true)
  }
  const handleDrawerClick = () => {
    updateDrawer(true)
  }

  return (
    <div className='w-full'>
      <div className='h-16 flex justify-end items-center'>
          <div className='max-md:hidden'>
            <Popover onOpenChange={onOpenChange} open={openPopover}>
              <PopoverTrigger>
                <div className='bg-sky-700 px-5 py-1.5 rounded-full 
                          hover:bg-sky-600 active:bg-sky-500' onClick={handlePopoverClick}>Connect wallet</div>
              </PopoverTrigger>     
              <PopoverContent align='end' ref={ref}>
                <WalletConnect />
              </PopoverContent>
            </Popover>
          </div>
          <div className='md:hidden'>
            <Drawer open={openDrawer}>
              <DrawerTrigger>
                <div className='bg-sky-700 px-5 py-1.5 rounded-full 
                            hover:bg-sky-600 active:bg-sky-500' onClick={handleDrawerClick}>Connect wallet</div>
              </DrawerTrigger>
              <DrawerContent ref={ref}>
                  <WalletConnect />
                </DrawerContent>
            </Drawer>
          </div>
          <Burger/>   
      </div>
    </div>
  )
}

export default Header