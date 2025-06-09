import { ConnectButton } from "@rainbow-me/rainbowkit"
import Burger from "./Burger"

type HeaderProps = {}
const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="h-16 sticky top-0 bg-black flex justify-end items-center main-margin">
            <ConnectButton accountStatus='address'/>
            <Burger/>
        </div>
    )
}

export default Header