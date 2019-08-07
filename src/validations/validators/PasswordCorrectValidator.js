const bcrypt = require('bcryptjs');

export default function PasswordCorrectValidator(validation) {
  return ((value) => {
    if (!validation.user && value) {
      return true;
    }
    return bcrypt.compareSync(value, validation.user.passwordHash);
  });
}
