import User from "./../models/user";
import PassportJwt from "passport-jwt";
const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "sG/1CKsjpAdpq6bSdGwlRU/8vOtHSk6Bbek2Qrd8bQdA3oynvapc1pTDGR+ZpDAIdSpdwjScUWC11dcjxP+uyTDliTcMiWGbxgMFghwaumhGfFOjJdMyCtXzWgl/sek4k5E/5FT2OGEERivH++wOhFvqSZBwNdckbXvHa6uIW2SGWs57VDiBTIzTJgVp/WgPji2DN8OLki9+hvyNm+KxcyUkieJqE9LunEPer09LG2lfq3oXKXXmb/saT0dGc3zmaV+De+TXqN7XN9Os+chfRQKzxswmc4fDqWlETkDQLVGtMfHmtnmXoDF+FQW/5iCWSv2sfekAgMtPaWKO0uGMgQ==";

export const passport = () => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload._id);
        if (user) return done(null, user);
        else return done(null, false);
      } catch (error) {
        console.log(error);
      }
    })
  );
};
