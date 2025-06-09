import { ConnectButton } from "@rainbow-me/rainbowkit"

type HeaderProps = {}
const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="h-16 sticky top-0 bg-black flex justify-end items-center main-margin">
            <ConnectButton accountStatus='address'/>
        </div>
    )
}

export default Header