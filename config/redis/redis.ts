import Redis from 'ioredis';

const REDIS_URL = 'redis://127.0.0.1:6739';

const client = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

export const opts = {
    createClient: (type: string): Redis.Redis => {
        switch (type) {
            case 'client':
                return client;
            case 'subscriber':
                return subscriber;
            default:
                return new Redis(REDIS_URL);
        }
    }
};