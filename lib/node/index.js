/**
 * Logger
 * A universal logging utility
 *
 * @module Logger
 */

const COLOR = require("./color");
const LOG_LEVEL = require("./log-level");

/**
 * Prints a message to the specified logging stream
 * @private
 * @param {import("stream").Writable} stream Logging stream
 * @param {string} message Formatted message
 */
function __print(stream, message)
{
    stream.write(message);
}

/**
 * Logger
 */
class Logger
{
    static COLOR = COLOR;
    static LOG_LEVEL = LOG_LEVEL;

    /**
     * Creates a logger instance
     */
    constructor()
    {
        this.stdout = process.stdout;
        this.stderr = process.stderr;
    }

    /**
     * Creates an ISO 8601 timestamp string
     * @static
     * @param {Date} date Date to format
     * @returns {string} Formatted timestamp string
     */
    static getTimestamp(date)
    {
        if(!date)
            date = new Date();

        let timestamp = "";

        timestamp += `${date.getUTCFullYear()}-`;
        timestamp += (date.getUTCMonth() < 10) ? `0${date.getUTCMonth()}-` : `${date.getUTCMonth()}-`;
        timestamp += (date.getUTCDate() < 10) ? `0${date.getUTCDate()}T` : `${date.getUTCDate()}T`;

        timestamp += (date.getUTCHours() < 10) ? `0${date.getUTCHours()}:` : `${date.getUTCHours()}:`;
        timestamp += (date.getUTCMinutes() < 10) ? `0${date.getUTCMinutes()}:` : `${date.getUTCMinutes()}:`;
        timestamp += (date.getUTCSeconds() < 10) ? `0${date.getUTCSeconds()}` : `${date.getUTCSeconds()}`;

        timestamp += "+00Z";

        return timestamp;
    }

    /**
     * Logs a message
     *
     * @param {import("./log-level").module} level Severity level of the message
     * @param {string} message Message to log
     */
    log(level, message)
    {
        let stream = this.stdout;

        if(level != LOG_LEVEL.INFO)
            stream = this.stderr;

        __print(stream, `[${Logger.getTimestamp()}] ${level} ${message}\n`);
    }
};

module.exports = Logger;
