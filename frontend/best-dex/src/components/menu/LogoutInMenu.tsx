import { AuthState, authState } from "@/lib/atoms"
import Logout from "@/lib/svgs/Logout"
import { useRecoilState } from "recoil"
import logger from "@/lib/logger"
import { MenuType } from "@/lib/types"

type LogoutInMenuProps = {
    menuType: MenuType
}

const LogoutInMenu: React.FC<LogoutInMenuProps> = ({menuType}) => {
    const [auth, setAuth] = useRecoilState<AuthState>(authState)

    const handleLogout = () => {
        logger.debug('handleLogout')
        setAuth({walletType: undefined, loginedUser: undefined})
    }
    return (
        <li className="group/li flex items-center h-[30px] my-[10px]" onClick={handleLogout}>
            <Logout className="h-[30px] w-[30px] text-rose-700"/>
            <div className={`ml-3 text-sm text-rose-700 font-medium ${menuType as MenuType === MenuType.MinMenu ? 'hidden' : ''}`}>Logout</div>
        </li>    
    )
}

export default LogoutInMenu