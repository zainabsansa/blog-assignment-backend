const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    const saltRounds = 8;
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
}
module.exports = {hashPassword};