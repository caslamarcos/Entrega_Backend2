import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';

import initializePassport from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import { PORT, MONGO_URL, DB_NAME } from './config/config.js';

const app = express();

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

// Conexión a Mongo y arranque del server
mongoose
  .connect(MONGO_URL, { dbName: DB_NAME })
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
  });