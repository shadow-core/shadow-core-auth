import { BasicController } from 'shadow-core-basic';
import AuthCore from '../AuthCore';

let jwt = require('jsonwebtoken');

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
    const token = jwt.sign(payload, this.app.config.auth.jwtSecret, { expiresIn: '1 year' });
    return res.json({
      token
    });
  }

}
