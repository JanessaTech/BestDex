import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    Drawer,
    DrawerDescription,
    DrawerTitle,
    DrawerContent,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useState } from "react"
import WalletConnect from "./WalletConnect"
import useMediaQuery from "@/hooks/useMediaQuery"
import logger from "@/lib/logger";

type WalletWrapperProps = {}

const WalletWrapper : React.FC<WalletWrapperProps> = () => {
    const [openWalletPopover, setOpenPopover] = useState(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('wallet_popover', false.toString())
        } 
        return false
      })
      const [openWalletDrawer, setOpendrawer] = useState(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('wallet_drawer', false.toString())
        }
        return false
      })

      const updatePopover = (status: boolean) => {
        setOpenPopover(status)
        localStorage.setItem('wallet_popover', status.toString())
      }

      const updateDrawer = (status: boolean) => {
        setOpendrawer(status)
        localStorage.setItem('wallet_drawer', status.toString())
      }

      const mediaQueryCallback = () => {
        logger.debug('handle mediaQueryCallback...')
        if (window.innerWidth <= 768) {
          const _openPopover = localStorage.getItem('wallet_popover') === 'true'
          if (_openPopover) {
            updatePopover(false)
            updateDrawer(true)
          }
        } else {
          const _openDrawer = localStorage.getItem('wallet_drawer') === 'true'
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

      const onWalletOpenChange = (open: boolean) => {
        logger.debug('onOpenChange is triggered. open=', open)
        updatePopover(open)
      }

      const onWalletDrawerOpenChange = (open: boolean) => {
        updateDrawer(open)
      }

      const handleDrawerClick = () => {
        updateDrawer(true)
      }

    return (
        <>
        <div className='max-md:hidden'>
            <Popover onOpenChange={onWalletOpenChange} open={openWalletPopover}>
              <PopoverTrigger>
                <div className='buttonEffect px-5 py-1.5 rounded-full' 
                     onClick={handlePopoverClick}>Connect wallet</div>
              </PopoverTrigger>     
              <PopoverContent align='end'>
                <WalletConnect onClose={onWalletOpenChange}/>
              </PopoverContent>
            </Popover>
          </div>
          <div className='md:hidden'>
            <Drawer open={openWalletDrawer} onOpenChange={onWalletDrawerOpenChange}>
              <DrawerTrigger>
                <div className='bg-sky-700 px-5 py-1.5 rounded-full 
                            hover:bg-sky-600 active:bg-sky-500' onClick={handleDrawerClick}>Connect wallet</div>
              </DrawerTrigger>
              <DrawerContent >
                  <VisuallyHidden.Root>
                    <DrawerTitle/>
                    <DrawerDescription/>
                  </VisuallyHidden.Root>
                  <WalletConnect onClose={onWalletDrawerOpenChange}/>
              </DrawerContent>
            </Drawer>
          </div>
        </>
    )
}

export default WalletWrapper