import { BasicController } from 'shadow-core-basic';
import AuthCore from '../AuthCore';

const jwt = require('jsonwebtoken');

/**
 * @class AuthController
 * @classdesc AuthController - authentication and working with tokens.
 * password reset
 */
export default class AuthController extends BasicController {
  /**
   * Constructor.
   *
   * @param {Object} app
   */
  constructor(app) {
    super(app);
    this.core = new AuthCore(app);
  }

  /**
   * Authenticate user and return token.
   *
   * @param req
   * @param res
   */
  async getUserTokenAction(req, res) {
    const errors = this.getValidationResult(req);

    if (!errors.isEmpty()) {
      const preparedErrors = this.prepareInvalidErrors(errors.array());
      if (this.core.checkVerificationError(preparedErrors)) {
        return this.returnError(
          this.core.jsonResponses.authGetUserToken.errors.email.notVerified,
          res, 401,
        );
      } else {
        return this.returnError(
          this.core.jsonResponses.authGetUserToken.errors.email.unauthorized,
          res, 401,
        );
      }
    }

    const user = req.foundUser;
    const payload = {
      type: 'user',
      id: user._id,
    };
    const token = jwt.sign(payload, this.app.config.auth.jwtSecret, {
      expiresIn: this.app.config.auth.tokenExpiresIn,
    });
    const refreshToken = jwt.sign(payload, this.app.config.auth.jwtSecretRefresh, {
      expiresIn: this.app.config.auth.refreshTokenExpiresIn,
    });
    return res.json({
      token,
      refreshToken,
    });
  }

  /**
   * Refresh access token.
   *
   * @param req
   * @param res
   * @return {Promise<*|void|Chai.Assertion|Promise<any>|*>}
   */
  async getUserTokenRefreshAction(req, res) {
    const user = req.user;
    const payload = {
      type: 'user',
      id: user._id,
    };
    const token = jwt.sign(payload, this.app.config.auth.jwtSecret, {
      expiresIn: this.app.config.auth.tokenExpiresIn,
    });
    const refreshToken = jwt.sign(payload, this.app.config.auth.jwtSecretRefresh, {
      expiresIn: this.app.config.auth.refreshTokenExpiresIn,
    });
    return res.json({
      token,
      refreshToken,
    });
  }
}
