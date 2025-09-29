class Logger {
    constructor() {
        this.logs = [];
    }
    
    get count_logs() {
        return this.logs.length;
    }

    info(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ message, timestamp });
        console.log(`Info: ${timestamp} - ${message}`);
    }
    
    error(message) {
        const timestamp = new Date().toISOString();
        this.logs.push( {message, timestamp });
        console.log(`Error: ${timestamp} - ${message}`);
    }
}

const Logger = require('../patterns/LoggerSingleton');
const logger = new Logger();

module.exports = { Logger, logger };