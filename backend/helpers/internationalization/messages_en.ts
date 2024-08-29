import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken"

type MessageType = {
    [key: string]: string
}

const message: MessageType = {
    // admin account
    account_login : 'Account {0} logined successfully(en)',
    account_register: 'Account {0} is registered successfully',
    account_login_wrong_password: 'login with wrong password',
    account_not_found: 'Account {0} is not found',
    account_getAll: 'Get all accounts successfully',
    account_getById : 'Get account by id {0} successfully',
    account_update : 'Account {0} is updated successfully',
    account_deleteById : 'Account {0} is deleted successfully',

    //user
    user_register: 'User {0} is registered successfully',
    user_register_duplication_name: 'User name {0} is already registered',
    user_register_duplication_address: 'The address {0} is already registered',
    user_register_validiation_failed: 'Failed to register user {0} due to validation failure',
    user_not_found_address:'User is not found by address {0}',
    user_not_found_id: 'User is not found by id(_id={0})',
    user_find_by_address:'Found an user by address {0}', 
    user_login_success: 'User login by address {0} successfully',
    user_logout_success: 'User logout by address {0} successfully',
    user_update_success: 'User(id={0}) is updated successfully with name {1}, intro {2} and profile {3}',
    user_update_failed: 'Failed to update user(id={0}) with name {1} and intro {2} due to {3}',
    user_overview_failed: 'Failed to get overview for user(id={0}) due to {1}',
    user_overview_success: 'Get the overview for user(id={0}) successfully',

    //http helper
    httpHelper_failed_getData: 'Failed to get data from url {0} due to {1}',

    // global
    UnSupportedAuthError : 'We only support Bearer token in Authorization',
    UnauthorizedError : 'You do not have enough permission(s) to visit {0}',
    ValidationError: 'Request includes invalid parameter(s)',
    JsonWebTokenError: 'Invalid token',
    TokenExpiredError: 'Token expired',
    UnmatchedTokenError: 'Token for user {0} is not matched',
    Error: 'Internal server error'
}

export default message