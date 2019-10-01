import { RouterBasic } from 'shadow-core-basic';

import AuthController from '../controllers/auth';
import AuthValidations from '../validations';
import RefreshPassportCheck from '../auth/refresh';

const asyncHandler = require('express-async-handler');

export default class AuthRouter extends RouterBasic {
  prepare() {
    this.authController = new AuthController(this.app);

    this.refreshPassportCheck = new RefreshPassportCheck(this.app);

    this.getUserTokenValidation = new AuthValidations.GetUserTokenValidation(this.app);
  }

  compile() {
    this.routeAuthUserToken();
    this.routeAuthUserTokenRefresh();
  }

  routeAuthUserToken() {
    this.app.router
      .route('/auth/user/token')
      .post(
        this.getUserTokenValidation.validators(),
        // we are missing "validate" method. No need to return 422, return only 401
        asyncHandler(this.authController.getUserTokenAction.bind(this.authController)),
      );
  }

  routeAuthUserTokenRefresh() {
    this.app.router
      .route('/auth/user/token/refresh')
      .post(
        this.refreshPassportCheck.authenticate.bind(this.refreshPassportCheck),
        asyncHandler(this.authController.getUserTokenRefreshAction.bind(this.authController)),
      );
  }
}
