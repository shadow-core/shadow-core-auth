import { ExpressCoreBasic } from 'shadow-core-basic';

/**
 * @class ExpressCoreAuth
 * @classdesc This is main class with all required methods for user actions.
 */
export default class ExpressCoreAuth extends ExpressCoreBasic {
  /**
   * Prepare json responses and get list if models.
   *
   * @param {Object} models
   */
  constructor(models, config) {
    super();
    this.models = models;
    this.config = config;

    this.addJsonResponses('authGetUserToken', require('./json_responses/getUserToken'));
  }

  /**
   * Find user by email.
   *
   * @param email
   * @returns {Promise.<void>}
   */
  async getUserByEmail(email) {

    let user = await User.findOne(
      {
        'email': email,
        'isDeleted': { $ne: true },
      }
    ).exec();
    return user;
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
      if (errors[0].code === 5) {
        result = true;
      }
    }
    return result;
  }
}
