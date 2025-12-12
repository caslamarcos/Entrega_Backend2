import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';


import initializePassport from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import { config } from './config/config.js';

const app = express();
const PORT = config.app.port;

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

// Conexión a Mongo y arranque del server
const { url, name } = config.db;

mongoose
  .connect(url, { dbName: name })
  .then(() => {
    console.log(`✅ Conectado a MongoDB: ${url}/${name}`);
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
  });