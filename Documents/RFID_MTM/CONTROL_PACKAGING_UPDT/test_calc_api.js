const axios = require('axios');

async function testCalc() {
    try {
        const res = await axios.get('http://localhost:3000/api/forecast/calc?year=2026');
        console.log('SUCCESS:', res.data.length, 'parts found');
    } catch (err) {
        if (err.response) {
            console.error('SERVER ERROR:', err.response.status, err.response.data);
        } else {
            console.error('NETWORK ERROR:', err.message);
        }
    }
}

testCalc();
