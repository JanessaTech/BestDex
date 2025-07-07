'use client'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Burger from "./Burger"
import { usePathname } from "next/navigation"

type HeaderProps = {}
const Header: React.FC<HeaderProps> = () => {
    const pathname = usePathname()
    const name = pathname === '/' ? 'Swap' : pathname.substring(1)
    return (
        <div className="h-20 z-50 sticky top-0 bg-black flex justify-between items-center main-margin">
            <div className="md:hidden">
                <img src="/imgs/logo.svg" alt="best DEX" 
                    width={50}
                    height={50}
                />
            </div>
            <div className="font-semibold text-xl capitalize hidden md:block">{name}</div>
            <div className="flex items-center">
                <ConnectButton accountStatus='address'/>
                <Burger/>
            </div>
        </div>
    )
}

export default Header