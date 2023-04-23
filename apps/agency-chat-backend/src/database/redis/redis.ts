import { createClient } from 'redis';
import configurations from '../../config';

const config = configurations();

const redisHost = config.database.redis.host;
const redisPort = config.database.redis.port;

//TODO: maybe create nestjs redis stuff
export const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});
