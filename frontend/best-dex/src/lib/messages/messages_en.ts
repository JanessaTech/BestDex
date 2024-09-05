type MessageType = {
    [key: string]: string
}

const messages_en: MessageType = {
    //metamask
    metamask_get_logined_user_success: '[{0}] Got a logined user by address {1} loginedUser = {2}',
    metamask_user_not_found: '[{0}]] User is not found by address {1} is found. Navigate to signup page',
    // user api
    user_failed_login: 'Failed to logout by address {0} due to {1}',
}

export default messages_en