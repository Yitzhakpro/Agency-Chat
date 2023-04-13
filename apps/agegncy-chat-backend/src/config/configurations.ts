export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  auth: {
    token: {
      secret: process.env.TOKEN_SECRET || 'supersecret',
    },
    cookie: {
      name: process.env.AUTH_COOKIE_NAME || 'authToken',
    },
  },
});
