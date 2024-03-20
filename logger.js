const bunyan = require('bunyan');
const path = require('path');

// Determine the environment and set the log directory accordingly
const environment = process.env.NODE_ENV || 'development'; 
let logDirectory = '/var/webapp'; 
if (environment === 'development') {
    logDirectory = '/var/webapp';
} else if (environment === 'test') {
    logDirectory = '/tmp/webapps';
} else if (environment === 'production') {
    logDirectory = '/var/webapp/logs';
}

// Configure the logger
const logger = bunyan.createLogger({
    name: 'myapp',
    streams: [
        {
            level: 'info',
            type: 'rotating-file',
            path: path.join(logDirectory, 'myapp.log'),
            period: '1d', 
            count: 7 
        },
        {
            level: 'error',
            type: 'rotating-file',
            path: path.join(logDirectory, 'myapp.log'),
            period: '1d', 
            count: 7 
        }
    ]
});

module.exports = logger;
