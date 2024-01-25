import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (err) => {
  console.error('Redis client failed to connect:', err.message || err.toString());
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

export default redisClient;