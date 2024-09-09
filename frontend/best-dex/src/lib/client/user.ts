import logger from "../logger"
import axios from 'axios'
import getConfig from "@/config"
import messageHelper from "../messages/messageHelper"

export type UserType = {
    id: number,
    name: string,
    address: string,
    profile: string,
    intro?: string,
    createdAt: Date,
    updatedAt?: Date,
    loginTime?: Date,
    logoutTime?: Date
}

const config = getConfig()

export const loginByAddress = async (address: string): Promise<UserType> => {
    logger.debug('[client.user] loginByAddress. address =', address)
    try {
        const response = await axios.post(`${config.BACKEND_ADDR}/apis/v1/users/login`,{
            address: address
        })
        logger.debug('response =', response)
        return response?.data?.data?.user
    } catch (err: any) {
        const reason = err?.response?.data?.message || err?.message || err
        logger.error('[client.user] loginByAddress.', messageHelper.getMessage('user_failed_login', address, reason))
        logger.error(err)
        throw err
    }
}

export const register = async (formData: FormData): Promise<UserType> => {
    logger.debug('[client.user] register')
    try {
        const response = await axios.post(`${config.BACKEND_ADDR}/apis/v1/users/register`, formData, {
        headers: {'Content-Type': 'multipart/form-data'}})
        return response?.data?.data?.user
    } catch (err: any) {
        const reason = err?.response?.data?.message || err?.message || err
        logger.error('[client.user] register.', messageHelper.getMessage('user_failed_register', formData.get('name'), reason))
        logger.error(err)
        throw err
    }
}

export const logoutByAddress = async (address: string): Promise<UserType> => {
    logger.debug('[client.user] logoutByAddress. address =', address)
    try {
        const response = await axios.post(`${config.BACKEND_ADDR}/apis/v1/users/logout`,{
            address: address
        })
        logger.debug('response =', response)
        return response?.data?.data?.user
    } catch (err: any) {
        const reason = err?.response?.data?.message || err?.message || err
        logger.error('[client.user] logoutByAddress', messageHelper.getMessage('user_failed_logout', address, reason))
        logger.error(err)
        throw err
    }
}
