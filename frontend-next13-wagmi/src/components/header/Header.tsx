'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import Burger from "./Burger"
import { usePathname } from "next/navigation"
import SVGWebsocket from "@/lib/svgs/svg_websocket"
import ToolTipHelper from "../common/ToolTipHelper"
import { IContextUtil, useContextUtil } from "../providers/ContextUtilProvider"

type HeaderProps = {}
const Header: React.FC<HeaderProps> = () => {
    const pathname = usePathname()
    const name = pathname === '/' ? 'Swap' : pathname.substring(1)
    const {isWSConnected} = useContextUtil() as IContextUtil
    return (
        <div className="h-20 z-40 sticky top-0 bg-black flex justify-between items-center main-margin">
            <div className="md:hidden">
                <img src="/imgs/logo.svg" alt="best DEX" 
                    width={50}
                    height={50}
                />
            </div>
            <div className="font-semibold text-xl capitalize hidden md:block">{name}</div>
            <div className="flex items-center">
                <div className="px-2">
                    <ToolTipHelper content={<div className="w-20">{isWSConnected ? 'Websocket is connected' : 'Websocket is disconnected'}</div>}>
                        <SVGWebsocket className={`size-6 animate-bounce  cursor-pointer ${isWSConnected ? 'text-green-500' : 'text-zinc-500'}`}/>
                    </ToolTipHelper>
                </div>
                <ConnectButton accountStatus='address'/>
                <Burger/>
            </div>
        </div>
    )
}

export default Header