const { createClient } = require('redis');

// REDIS_URL should be set in your Railway environment variables
const redisUrl = process.env.REDIS_URL;
const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

(async () => {
    if (redisUrl) {
        await redisClient.connect();
        console.log('Connected to Redis');
    } else {
        console.warn('REDIS_URL not set. Redis caching is disabled.');
    }
})();

module.exports = redisClient;
