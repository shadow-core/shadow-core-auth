const bcrypt = require('bcryptjs');

export default function PasswordCorrect(validation) {
  return ((value) => {
    if (!validation.user) {
      return true;
    }
    return bcrypt.compareSync(value, validation.user.password_hash);
  });
}
