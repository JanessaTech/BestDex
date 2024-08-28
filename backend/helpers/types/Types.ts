import express from 'express';

const app = express()
const router = express.Router()

export type AppType = typeof app
export type RouterType = typeof router
