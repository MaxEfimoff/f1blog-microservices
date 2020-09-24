const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import { User } from '../db/models/User';

// JWT options
interface Opts {
  jwtFromRequest: string;
  secretOrKey: string;
}

const opts: Opts = {
  jwtFromRequest: null,
  secretOrKey: null,
};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;

// Exports JWT Strategy
export = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      // Serch for registered user
      const user = await User.findById(jwt_payload.id);

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    })
  );
};
