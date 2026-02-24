const bcrypt = require('bcryptjs');
const hash = '$2b$10$lreruX8TBL.DEdyUjeeTGOuqDiG0vHVc4GxgPKBT87SiKgbkcmMFK';

async function check() {
    console.log('admin:', await bcrypt.compare('admin', hash));
    console.log('admin123:', await bcrypt.compare('admin123', hash));
    console.log('password:', await bcrypt.compare('password', hash));
    console.log('123456:', await bcrypt.compare('123456', hash));
}
check();
