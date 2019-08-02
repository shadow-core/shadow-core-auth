import { BasicValidatorInterface } from 'shadow-core-basic';

import EmailExistsValidator from 'shadow-core-users/lib/validations/validators/EmailExistsValidator';
import EmailNotVerifiedValidator from 'shadow-core-users/lib/validations/validators/EmailNotVerifiedValidator';
import PasswordCorrectValidator from './validators/PasswordCorrectValidator';

const { body } = require('express-validator/check');
const jsonResponses = require('../json_responses/getUserToken');

/**
 * @class SignupUserValidator
 * @class validator for SignupUser action.
 */
export default class GetUserTokenValidation extends BasicValidatorInterface {
  /**
   *
   * @return {this[]}
   */
  validators() {
    return [
      // email
      body('email').trim()
        .not().isEmpty().withMessage(jsonResponses.errors.email.empty)
        .isEmail().withMessage(jsonResponses.errors.email.invalid)
        .custom(EmailExistsValidator(this)).withMessage(jsonResponses.errors.email.notExists)
        .custom(EmailNotVerifiedValidator(this)).withMessage(jsonResponses.errors.email.notVerified),
      body('password')
        .not().isEmpty().withMessage(jsonResponses.errors.password.empty)
        .custom(PasswordCorrectValidator(this)).withMessage(jsonResponses.errors.password.incorrect)
    ];
  }


}
