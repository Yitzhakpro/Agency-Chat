import type { CorsOptions } from './types';
import type { CookieSerializeOptions } from '@fastify/cookie';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  corsConfig: {
    origin: process.env.ORIGIN || 'http://localhost:3000',
    credentials: true,
  } as CorsOptions,
  auth: {
    token: {
      secret: process.env.TOKEN_SECRET || 'supersecret',
    },
    cookie: {
      name: process.env.AUTH_COOKIE_NAME || 'authToken',
      options: {
        httpOnly: true,
        path: '/',
        sameSite: true,
        maxAge: 86_400,
      } as CookieSerializeOptions,
    },
  },
  database: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
  },
});
