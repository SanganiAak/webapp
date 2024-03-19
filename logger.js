const bunyan = require('bunyan');
const path = require('path');

const logger = bunyan.createLogger({
    name: 'myapp',
    streams: [
        {
            level: 'info',
            type: 'rotating-file',
            path: path.join('/var/webapp', 'myapp.log'),
            period: '1d', 
            count: 7 
        }
    ]
});

module.exports = logger;
