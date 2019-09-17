import { ExpressCoreBasic } from 'shadow-core-basic';

/**
 * @class AuthCore
 * @classdesc This is main class with all required methods for user actions.
 */
export default class AuthCore extends ExpressCoreBasic {
  /**
   * AuthCore constructor
   *
   * @param {Object} models
   */
  constructor(app) {
    super(app);

    if (this.app.config.auth.tokenExpiresIn === undefined) {
      this.app.config.auth.tokenExpiresIn = '1 hour';
    }
    if (this.app.config.auth.refreshTokenExpiresIn === undefined) {
      this.app.config.auth.refreshTokenExpiresIn = '1 day';
    }

    this.addJsonResponses('authGetUserToken', require('./json_responses/getUserToken'));
  }

  /**
   * Check is there's a email verification error
   *
   * @param errors
   * @returns {boolean}
   */
  checkVerificationError(errors) {
    let result = false;
    if (errors.length === 1) {
      if (errors[0].code === 4) {
        result = true;
      }
    }
    return result;
  }
}
