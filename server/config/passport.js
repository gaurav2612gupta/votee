const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const Admin = require("../models/admin");
const Voter = require("../models/voter");
const keys = require("./key");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      //console.log(jwt_payload)

      const admin = await Admin.findById(jwt_payload.id);
      const voter = await Voter.findById(jwt_payload.id);

      if (admin) {
        return done(null, admin);
      } else if (voter) {
        return done(null, voter);
      } else {
        console.log("Error");
      }
    })
  );
};
