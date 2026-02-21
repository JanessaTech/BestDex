import express from 'express';
import app from './app'
import initInfra from './infra';
import './config/data/hardcode';
import { connectDB } from './db/initDB';

export async function createApp(): Promise<express.Application>  {
    await connectDB()
    initInfra(app)
    return app;
}
