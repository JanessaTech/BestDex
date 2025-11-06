import Redis from 'ioredis';
import dotenv from 'dotenv';
import logger from "../../helpers/logger";

dotenv.config();

interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db?: number;
}

class RedisClient {
    private client: Redis;

    constructor(config: RedisConfig) {
        logger.debug('constructing Redis client ...')
        this.client = new Redis(config)
    }

    public init() {
        this.initEventListener()
    }

    private initEventListener(): void {
        this.client.on('connect', () => logger.info('Connected to Redis'));
        this.client.on('error', (err) => {
            logger.error('Redis error:', err)
            process.exit()
        });
    }

    async set(key:string, value:string, ttl?: number): Promise<boolean> {
        try {
            if (ttl) {
                await this.client.setex(key, ttl, value)
            } else {
                await this.client.set(key, value)
            }
            return true
        } catch(err) {
            logger.error('Redis set error:', err)
            return false
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key)
        } catch (err) {
            logger.error('Redis get error:', err)
            return null
        }
    }

    async delete(key: string): Promise<boolean> {
        try {
            const res = await this.client.del(key)
            return res > 0
        } catch (err) {
            logger.error('Redis delete error:', err)
            return false
        }
    }

}

const config: RedisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0')
};
const redisClient = new RedisClient(config)
export default redisClient