import AuthController from '../controllers/auth';
import GetUserTokenValidation from '../validations/GetUserTokenValidation';

const asyncHandler = require('express-async-handler');

/**
 * Return all default user routes for express router.
 *
 * @param {Object} router Express router
 * @param {Object} models Application models
 * @param {Object} config Additional configuration
 */
export default function (router, models, config) {
  const authController = new AuthController(models, config);

  const getUserTokenValidation = new GetUserTokenValidation(models);

  router
    .route('/auth/token')
    .post(
      getUserTokenValidation.validators(),
      authController.validate.bind(authController),
      asyncHandler(authController.getUserTokenAction.bind(authController)),
    );
}
