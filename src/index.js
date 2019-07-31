// main classes
import ExpressCoreAuth from './ExpressCoreAuth';
import ExpressCoreAuthValidations from './validations';
import AuthController from './controllers/auth';
import AuthRouter from './router/auth';

//tests
import ExpressCoreAuthTestsUserToken from './tests/userToken';

export {
  // export main classes
  ExpressCoreAuth,
  ExpressCoreAuthValidations,
  AuthController,
  // Router
  AuthRouter,
  // Tests
  ExpressCoreAuthTestsUserToken
};
