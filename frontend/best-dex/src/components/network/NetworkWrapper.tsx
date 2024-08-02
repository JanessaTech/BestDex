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
import { useState } from "react"
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import useMediaQuery from "@/hooks/useMediaQuery"
import { NetworkType } from "@/lib/types";
import { defaultNetwork } from "@/lib/constants";
import NetworkConnect from "./NetworkConnect";

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
      const [network, setNetwork] = useState<NetworkType>(defaultNetwork)

      const handleNetworkChange = (network: NetworkType) => {
        console.log('handleNetworkChange')
        console.log(network)
        setNetwork(network)
        updatePopover(false)
        updateDrawer(false)
      }

      const updatePopover = (status: boolean) => {
        setOpenPopover(status)
        localStorage.setItem('network_popover', status.toString())
      }

      const updateDrawer = (status: boolean) => {
        setOpendrawer(status)
        localStorage.setItem('network_drawer', status.toString())
      }

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

      const onDrawerOpenChange = (open: boolean) => {
        updateDrawer(open)
      }

      const handleDrawerClick = () => {
        updateDrawer(true)
      }
    return (
        <>
            <div className='flex items-center mr-3 max-md:hidden'>
                <Popover onOpenChange={onOpenChange} open={openNetworkPopover}>
                <PopoverTrigger>
                    <img src={`/imgs/networks/${network.name}.png`} 
                          width={25}  height={25} 
                          alt={network.name} 
                          onClick={handlePopoverClick}/>
                </PopoverTrigger>
                <PopoverContent align='center' sideOffset={10}>
                    <NetworkConnect network={network} handleNetworkChange={handleNetworkChange}/>
                </PopoverContent>
                </Popover>
            </div>
            <div className='flex items-center mr-3 md:hidden'>
                <Drawer open={openNetworkDrawer} onOpenChange={onDrawerOpenChange}>
                <DrawerTrigger>
                    <img src={`/imgs/networks/${network.name}.png`} 
                          width={25}  height={25} alt={network.name} 
                          onClick={handleDrawerClick}/>
                </DrawerTrigger>
                <DrawerContent>
                    <VisuallyHidden.Root>
                      <DrawerTitle/>
                      <DrawerDescription/>
                    </VisuallyHidden.Root>
                    <NetworkConnect network={network} handleNetworkChange={handleNetworkChange}/>
                </DrawerContent>
                </Drawer>
            </div>
        </>
    )
}

export default NetworkWrapper