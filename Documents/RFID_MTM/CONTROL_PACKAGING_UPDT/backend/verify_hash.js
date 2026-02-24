const bcrypt = require('bcryptjs');
const hash = '$2b$10$lreruX8TBL.DEdyUjeeTGOuqDiG0vHVc4GxgPKBT87SiKgbkcmMFK';
const password = 'admin';

bcrypt.compare(password, hash).then(res => {
    console.log(`Password "${password}" matches hash: ${res}`);
    if (!res) {
        bcrypt.hash('admin', 10).then(newHash => {
            console.log(`New hash for "admin": ${newHash}`);
        });
    }
});
