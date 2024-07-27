"use client"

import React, { useEffect, useRef, useState } from 'react'
import Burger from './burger'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const mediaQuery = '(max-width: 768px)';
const mediaQueryList = window.matchMedia(mediaQuery);

type HeaderProps = {}

const Header:React.FC<HeaderProps> = () => {
  const [openPopover, setOpenPopover] = useState(false)
  const [openDrawer, setOpendrawer] = useState(false)
  const ref = useRef<HTMLDivElement>(null);

  const onOpenChange = (open: boolean) => {
    console.log('onOpenChange is triggered. open=', open)
    setOpenPopover(open)
  }

  const handleClick = () => {
    updatePopover(true)
  }

  const updatePopover = (status: boolean) => {
    setOpenPopover(status)
    localStorage.setItem('popover', status.toString())
  }

  const updateDrawer = (status: boolean) => {
    setOpendrawer(status)
    localStorage.setItem('drawer', status.toString())
  }

  useEffect(() => {
    const handleChange = (event:any) => {
      console.log('handleChange...')
      console.log('window.innerWidth = ', window.innerWidth)
      console.log(window.innerWidth === 768)
      if (window.innerWidth <= 768) {
        console.log('window.innerWidth <= 768')
        const _openPopover = localStorage.getItem('popover') === 'true'
        console.log('_openPopover =', _openPopover)
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

    const handleOutSideClick = (event:any) => {
      console.log('handleOutSideClick')
      console.log(event)
      console.log(ref)

      console.log(ref.current?.contains(event.target))
      if (!ref.current?.contains(event.target)) {
        updatePopover(false)
        // setOpenPopover(false)
        // localStorage.setItem('popover', 'false')
      }
    };

    window.addEventListener("mousedown", handleOutSideClick); 
    mediaQueryList.addEventListener('change', handleChange)
    console.log('addEventListener ')
    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
      window.removeEventListener("mousedown", handleOutSideClick);
    }
  }, [])

  return (
    <div className='w-full'>
      <div className='h-16 flex justify-end items-center'>
          <div className='max-md:hidden'>
            <Popover onOpenChange={onOpenChange} open={openPopover}>
              <PopoverTrigger>
                <div className='bg-sky-700 px-5 py-1.5 rounded-full 
                          hover:bg-sky-600 active:bg-sky-500' onClick={handleClick}>Connect wallet</div>
              </PopoverTrigger>
              <PopoverContent className='' align='end' ref={ref}>Place content for the popover here.</PopoverContent>
            </Popover>
          </div>
          <div className='md:hidden'>
            <Drawer open={openDrawer}>
              <DrawerTrigger>
                <div className='bg-sky-700 px-5 py-1.5 rounded-full 
                            hover:bg-sky-600 active:bg-sky-500'>Connect wallet</div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                  <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <div>Submit</div>
                  <DrawerClose>
                    <div>Cancel</div>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <Burger/>   
      </div>
    </div>
  )
}

export default Header