import bcrypt from 'bcrypt'
import logger from '../helpers/logger';
import { AccountError } from '../routes/account/AccountErrors';
import type { LoginInPutType, AccountInfoType } from '../controllers/types/TypesInController';
import { AccountService } from './types/TypesInService';

class AccountServiceImp implements AccountService {
    accountMap = new Map<string, AccountInfoType>()
    cnt = 0
    async login(acc: LoginInPutType) {
        logger.info('AccountService.login...')
        let users = this.findAccount(acc.name)
        if (users.length !== 0) {
            if (bcrypt.compareSync(acc.password,users[0].password)) {
                return users[0]
            } else {
                throw new AccountError({key: 'account_login_wrong_password'})

            }
        } else {
            throw new AccountError({key: 'account_not_found', params:[acc.name], code:404})
        }
    }

    findAccount(name: string) {
        return Array.from(this.accountMap.values()).filter(value => value.name === name)
    }

    async register(acc: AccountInfoType) {
        logger.info('AccountService.register...')
        acc.id = this.cnt.toString()
        this.accountMap.set(this.cnt.toString(), acc)
        this.cnt++
        return acc
    }

    async getAllAccounts() {
        return Object.fromEntries(this.accountMap)
    }

    async getAccountById(id: string) {
        if (this.accountMap.has(id)) {
            return this.accountMap.get(id)
        } else {
            throw new AccountError({key: 'account_not_found', params:[id], code:404})
        }
    }

    getAccountByIdInSyn(id: string) {
        if (this.accountMap.has(id)) {
            return this.accountMap.get(id)
        } else {
            throw new AccountError({key: 'account_not_found', params:[id], code:404})
        }
    }

    async updateAccount(acc: AccountInfoType) {
        if (acc.id && this.accountMap.has(acc.id)) {
            this.accountMap.set(acc.id, acc)
            return acc
        } else {
            throw new AccountError({key: 'account_not_found', params:[acc.name], code:404})
        }
    }

    async deleteAccountById(id: string) {
        if (this.accountMap.has(id)) {
            this.accountMap.delete(id)
        } else {
            throw new AccountError({key: 'account_not_found', params:[id], code:404})
        }
    }
}

const accountService = new AccountServiceImp()
export default accountService