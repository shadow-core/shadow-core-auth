// main classes
import AuthCore from './AuthCore';
import AuthValidations from './validations';
import AuthController from './controllers/auth';
import AuthRouter from './router/auth';
import AuthPassportCheck from './auth/auth';

// tests
import AuthTests from './tests';

export {
  // export main classes
  AuthCore,
  AuthValidations,
  AuthController,
  // Router
  AuthRouter,
  // Tests
  AuthTests,
  // PassportAuthentication
  AuthPassportCheck,
};
