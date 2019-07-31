import { BasicController } from 'shadow-core-basic';
import ExpressCoreAuth from '../ExpressCoreAuth';

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
   * @param {Object} models
   * @param {Object} config
   */
  constructor(models, config = {}) {
    super(models, config);
    this.core = new ExpressCoreAuth(this.models, this.config);
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
      let prepared_errors = this.prepareInvalidErrors(errors.array());
      if (this.core.checkVerificationError(prepared_errors)) {
        return this.returnError(this.core.jsonResponses.authGetUserToken.errors.email.notVerified, res, 401);
      } else {
        return this.returnError(this.core.jsonResponses.authGetUserToken.errors.email.unauthorized, res, 401);
      }
    }

    let user = req.foundUser;
    let payload = {
      type: 'user',
      id: user._id
    };
    let token = jwt.sign(payload, this.config.jwtSecret, { expiresIn: '1 year' });
    return res.json({
      token: token
    });
  }

}
