import { ConnectButton } from "@rainbow-me/rainbowkit"
import Burger from "./Burger"

type HeaderProps = {}
const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="h-20 z-50 sticky top-0 bg-black flex justify-between md:justify-end items-center main-margin">
            <div className="md:hidden">
                <img src="/imgs/logo.svg" alt="best DEX" 
                    width={50}
                    height={50}
                />
            </div>
            <div className="flex items-center">
                <ConnectButton accountStatus='address'/>
                <Burger/>
            </div>
        </div>
    )
}

export default Header