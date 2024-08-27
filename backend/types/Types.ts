import express from 'express';

const app = express()
const router = express.Router()

export type AppType = typeof app
export type RouterType = typeof router
export type TokenGeneratedParams = {
    id: number
    name: string
    roles: any[]
    email: string,
    token?: string
}
