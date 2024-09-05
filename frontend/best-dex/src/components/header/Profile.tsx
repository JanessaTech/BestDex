import { UserType } from "@/lib/client/user"
import getConfig from "@/config"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

const config = getConfig()

type ProfileProps = {
    loginedUser: UserType
}

const Profile: React.FC<ProfileProps> = ({loginedUser}) => {
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Avatar className="w-7 h-7 cursor-pointer">
                            <AvatarImage src={`${config.BACKEND_ADDR}/${loginedUser.profile}`}/>
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent align="end">
                    <p>{loginedUser.name}</p>
                    <p>{loginedUser.address}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
        </div>
    )
}

export default Profile