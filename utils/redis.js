
const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const redisClient = createClient({ url: redisUrl });

let isConnected = false;

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
    isConnected = false;
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
    isConnected = true;
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.warn('Redis connection failed:', err);
    }
})();

redisClient.isOpen = () => isConnected;

module.exports = redisClient;
