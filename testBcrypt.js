const bcrypt = require('bcryptjs');

const test = async () => {
    const pass = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    console.log('Hash:', hash);
    const isMatch = await bcrypt.compare(pass, hash);
    console.log('Match:', isMatch);
};

test();
