const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

export default class RefreshPassportCheck {
  constructor(app) {
    this.app = app;

    this.params = {
      secretOrKey: this.app.config.auth.jwtSecretRefresh,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    this.strategy = new Strategy(this.params, (payload, done) => {
      this.app.models.User.findOne(
        {
          _id: payload.id,
          isDeleted: { $ne: true },
        },
      ).exec((err, user) => {
        if (err || !user) {
          return done(null, false);
        }
        if (!user.checkEmailVerified()) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
    passport.use('jwt-refresh', this.strategy);
  }

  authenticate(req, res, next) {
    const result = passport.authenticate('jwt-refresh', this.app.config.auth.jwtSession, (err, user, info) => {
      if (!user) {
        return res.status(401).json({'success': false, 'code': 401, 'message': 'Unauthorized'});
      } else {
        req.user = user;
        next();
      }
    })(req, res, next);
    return result;
  }
}
