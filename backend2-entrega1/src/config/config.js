import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 8080;

export const MONGO_URL = process.env.MONGO_URL;
export const DB_NAME = process.env.DB_NAME || 'backend2_entrega1';

export const JWT_SECRET = process.env.JWT_SECRET || 'coderBackendIISecret';
export const COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookieSecretBackendII';

export const PERSISTENCE = process.env.PERSISTENCE || 'MONGO';

export const GMAIL_USER = process.env.GMAIL_USER || '';
export const GMAIL_PASS = process.env.GMAIL_PASS || '';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';