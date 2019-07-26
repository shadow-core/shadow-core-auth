const bcrypt = require('bcryptjs');

export default function PasswordCorrect(validation) {
  return ((value) => {
    if (!validation.user) {
      return true;
    }
    if (!bcrypt.compareSync(value, user.password_hash)) {
      throw new Error(JSON.stringify(json_answers.getErrorPasswordIncorrect()));
    }
  });
}
