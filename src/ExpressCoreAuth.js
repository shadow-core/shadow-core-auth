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
}
