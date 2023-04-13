import { CorsOptions } from './types';

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
    },
  },
});
