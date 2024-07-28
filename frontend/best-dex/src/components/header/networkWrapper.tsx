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
import useOutsideClick from "@/hooks/useOutsideClick"
import useMediaQuery from "@/hooks/useMediaQuery"
import NetworkConnect from "../network/networkConnect"

type NetworkWrapperProps = {}

const NetworkWrapper : React.FC<NetworkWrapperProps> = () => {
    const [openNetworkPopover, setOpenPopover] = useState(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('network_popover', false.toString())
        } 
        return false
      })
      const [openNetworkDrawer, setOpendrawer] = useState(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('network_drawer', false.toString())
        }
        return false
      })

      const updatePopover = (status: boolean) => {
        setOpenPopover(status)
        localStorage.setItem('network_popover', status.toString())
      }

      const updateDrawer = (status: boolean) => {
        setOpendrawer(status)
        localStorage.setItem('network_drawer', status.toString())
      }

      
      const outSideClickCallback = () => {
        console.log('handle network outSideClickCallback...')
        updateDrawer(false)
      }
    
      const ref = useOutsideClick(outSideClickCallback)  // custom outsideClick hook

      const mediaQueryCallback = () => {
        console.log('handle network mediaQueryCallback...')
        if (window.innerWidth <= 768) {
          const _openPopover = localStorage.getItem('network_popover') === 'true'
          if (_openPopover) {
            updatePopover(false)
            updateDrawer(true)
          }
        } else {
          const _openDrawer = localStorage.getItem('network_drawer') === 'true'
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
            <div className='flex items-center mr-3 max-md:hidden'>
                <Popover onOpenChange={onOpenChange} open={openNetworkPopover}>
                <PopoverTrigger>
                    <img src="/imgs/networks/ethereum.png" width={25}  height={25} alt="" onClick={handlePopoverClick}/>
                </PopoverTrigger>
                <PopoverContent align='center' sideOffset={10}>
                    <NetworkConnect/>
                </PopoverContent>
                </Popover>
            </div>
            <div className='flex items-center mr-3 md:hidden'>
                <Drawer open={openNetworkDrawer}>
                <DrawerTrigger>
                    <img src="/imgs/networks/ethereum.png" width={25}  height={25} alt="" onClick={handleDrawerClick}/>
                </DrawerTrigger>
                <DrawerContent ref={ref} className="text-red-700">
                    <NetworkConnect/>
                </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}

export default NetworkWrapper