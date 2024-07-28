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
import { useState } from "react"
import WalletConnect from "../wallet/walletConnect"
import useOutsideClick from "@/hooks/useOutsideClick"
import useMediaQuery from "@/hooks/useMediaQuery"

type MenuWrapperProps = {}

const MenuWrapper : React.FC<MenuWrapperProps> = () => {
    const [openMenuPopover, setOpenPopover] = useState(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('menu_popover', false.toString())
        } 
        return false
      })
      const [openMenuDrawer, setOpendrawer] = useState(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('menu_drawer', false.toString())
        }
        return false
      })

      const updatePopover = (status: boolean) => {
        setOpenPopover(status)
        localStorage.setItem('menu_popover', status.toString())
      }

      const updateDrawer = (status: boolean) => {
        setOpendrawer(status)
        localStorage.setItem('menu_drawer', status.toString())
      }

      
      const outSideClickCallback = () => {
        console.log('handle outSideClickCallback...')
        updateDrawer(false)
      }
    
      const ref = useOutsideClick(outSideClickCallback)  // custom outsideClick hook

      const mediaQueryCallback = () => {
        console.log('handle mediaQueryCallback...')
        if (window.innerWidth <= 768) {
          const _openPopover = localStorage.getItem('menu_popover') === 'true'
          if (_openPopover) {
            updatePopover(false)
            updateDrawer(true)
          }
        } else {
          const _openDrawer = localStorage.getItem('menu_drawer') === 'true'
          if (_openDrawer) {
            updatePopover(true)
            updateDrawer(false)
          }
        }
    }
    useMediaQuery(mediaQueryCallback) // custom mediaQuery hook

      const handlePopoverClick = () => {
        updatePopover(true)
      }

      const onOpenChange = (open: boolean) => {
        console.log('onOpenChange is triggered. open=', open)
        updatePopover(open)
      }

      const handleDrawerClick = () => {
        updateDrawer(true)
      }

    return (
        <>
        <div className='max-md:hidden'>
            <Popover onOpenChange={onOpenChange} open={openMenuPopover}>
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
            <Drawer open={openMenuDrawer}>
              <DrawerTrigger>
                <div className='bg-sky-700 px-5 py-1.5 rounded-full 
                            hover:bg-sky-600 active:bg-sky-500' onClick={handleDrawerClick}>Connect wallet</div>
              </DrawerTrigger>
              <DrawerContent ref={ref}>
                  <WalletConnect />
              </DrawerContent>
            </Drawer>
          </div>
        </>
    )
}

export default MenuWrapper