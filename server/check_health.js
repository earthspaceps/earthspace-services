const axios = require('axios');
const API_URL = 'https://services.earthspaceprojects.in/api/health';

async function checkHealth() {
    try {
        const res = await axios.get(API_URL);
        console.log('API Health Check:', res.data);
        process.exit(0);
    } catch (err) {
        console.error('API Health Check Failed:', err.message);
        process.exit(1);
    }
}

checkHealth();
