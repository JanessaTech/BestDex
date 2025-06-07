import { ConnectButton } from "@rainbow-me/rainbowkit"

type HeaderProps = {}
const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="h-16 sticky top-0 bg-black">
            <ConnectButton accountStatus='address'/>
        </div>
    )
}

export default Header