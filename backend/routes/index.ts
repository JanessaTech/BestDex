import { Request, Response } from "express";
import express from 'express';
const app = express()

type AppType = typeof app

const router = (app: AppType) => {
    app.get("/", (req: Request, res: Response) => {
            res.send("Express + TypeScript Server!!!");
    });
}

export default router