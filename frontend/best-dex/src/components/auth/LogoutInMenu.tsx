import { AuthState, authState } from "@/lib/atoms"
import Logout from "@/lib/svgs/Logout"
import { useRecoilState } from "recoil"
import logger from "@/lib/logger"
import { MenuType } from "@/lib/types"
import {user as UserClient} from '../../lib/client'
import { toast } from "sonner"

type LogoutInMenuProps = {
    menuType: MenuType
}

const LogoutInMenu: React.FC<LogoutInMenuProps> = ({menuType}) => {
    const [auth, setAuth] = useRecoilState<AuthState>(authState)
    
    const handleLogout = () => {
        logger.debug('handleLogout')
        if (auth.loginedUser) {
            UserClient.logoutByAddress(auth.loginedUser?.address)
            .then(() => {
                setAuth({walletType: undefined, loginedUser: undefined})
                toast.success('Logout sucessfully')
            })
            .catch(err => {
                logger.error('Failed to logout by address ', auth.loginedUser?.address)
                    logger.error(err)
                    let errMsg = ''
                    if (err?.response?.data?.message) {
                        errMsg = err?.response?.data?.message
                    } else {
                        errMsg = err?.message
                    }
                    toast.error(errMsg)
            })  
        }
    }
    return (
        <li className="group/li flex items-center h-[30px] my-[10px]" onClick={handleLogout}>
            <Logout className="h-[30px] w-[30px] text-rose-700"/>
            <div className={`ml-3 text-sm text-rose-700 font-medium ${menuType as MenuType === MenuType.MinMenu ? 'hidden' : ''}`}>Logout</div>
        </li>    
    )
}

export default LogoutInMenu