import AuthController from '../controllers/auth';
import AuthValidations from '../validations';

const asyncHandler = require('express-async-handler');

/**
 * Return all default user routes for express router.
 *
 * @param {Object} router Express router
 * @param {Object} models Application models
 * @param {Object} config Additional configuration
 */
export default function (app) {
  const authController = new AuthController(app);

  const getUserTokenValidation = new AuthValidations.GetUserTokenValidation(app);

  app.router
    .route('/auth/user/token')
    .post(
      getUserTokenValidation.validators(),
      // we are missing "validate" method. No need to return 422, return only 401
      asyncHandler(authController.getUserTokenAction.bind(authController)),
    );
}
