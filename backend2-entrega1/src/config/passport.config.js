import passport from 'passport';
import jwt from 'passport-jwt';
import { userModel } from '../dao/models/user.model.js';
import { cookieExtractor, JWT_SECRET } from '../utils.js';

const JwtStrategy = jwt.Strategy;

const initializePassport = () => {
  // Estrategia JWT general
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findById(jwt_payload._id).lean();
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia current
  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          const user = await userModel.findById(jwt_payload._id).lean();
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;