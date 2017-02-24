const config = require('./config/config.json');
const scom = require('scom-server');

// Start the scom server
scom.default.start(config);
