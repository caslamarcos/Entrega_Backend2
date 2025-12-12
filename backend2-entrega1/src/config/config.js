import 'dotenv/config';

export const config = {
  app: {
    port: process.env.PORT || 8080,
    baseUrl: process.env.BASE_URL || 'http://localhost:8080'
  },

  db: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'backend2_entrega_final'
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'coderBackendIISecret',
    cookieName: process.env.COOKIE_NAME || 'jwtCookieToken',
    expiresIn: '24h'
  },

  mail: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || ''
  }
};