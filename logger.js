const bunyan = require('bunyan');
const path = require('path');
const fs = require('fs');

const mapLevelToSeverity = (level) => {
    return {
        10: 'trace',
        20: 'debug',
        30: 'info',
        40: 'warn',
        50: 'error',
        60: 'fatal',
    }[level] || 'unknown';
};

class SeverityStream {
    constructor(filePath) {
        this.stream = fs.createWriteStream(filePath, { flags: 'a' });
    }

    write(record) {
        if (typeof record === 'string') {
            record = JSON.parse(record);
        }

        const clonedRecord = { ...record };

        clonedRecord.severity = mapLevelToSeverity(clonedRecord.level);

        this.stream.write(JSON.stringify(clonedRecord) + '\n');
    }
}

const environment = process.env.NODE_ENV || 'development';
let logDirectory = '/var/webapp';
switch (environment) {
    case 'development':
        logDirectory = '/var/webapp';
        break;
    case 'test':
        logDirectory = '/tmp/webapps';
        break;
    case 'production':
        logDirectory = '/var/webapp/logs';
        break;
}

const logger = bunyan.createLogger({
    name: 'myapp',
    streams: [
        {
            level: 'info',
            stream: new SeverityStream(path.join(logDirectory, 'myapp.log')),
            type: 'raw' 
        }
    ]
});

module.exports = logger;
