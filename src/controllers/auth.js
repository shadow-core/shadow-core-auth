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
