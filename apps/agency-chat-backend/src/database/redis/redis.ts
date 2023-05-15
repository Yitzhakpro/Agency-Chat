import { createClient } from 'redis';
import configurations from '../../config';

const config = configurations();

const redisHost = config.database.redis.host;
const redisPort = config.database.redis.port;

//TODO: maybe create nestjs redis stuff
export const sessionClient = createClient({
	database: 0,
	url: `redis://${redisHost}:${redisPort}`,
});

export const userStatusClient = createClient({
	database: 1,
	url: `redis://${redisHost}:${redisPort}`,
});
