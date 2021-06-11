/**
 * Logger
 * A universal logging utility
 *
 * @module Logger
 */

const fs = require("fs");

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
     *
     * @param {import("stream").Writable} [outStream] Output log stream
     * @param {import("stream").Writable} [errStream] Error log stream
     * @param {string} [outFile] Path to output log file
     * @param {string} [errFile] Path to error log file
     */
    constructor(outStream, errStream, outFile, errFile)
    {
        if(!outStream)
            outStream = process.stdout;

        if(!errStream)
            errStream = outStream;

        if(typeof outFile === "string")
            this.outfile = fs.createWriteStream(outFile, { flags: "a"});

        if(typeof errFile === "string")
            this.errfile = fs.createWriteStream(errFile, { flags: "a"});
        else
            this.errfile = this.outfile;

        this.stdout = outStream;
        this.stderr = errStream;
    }

    /**
     * Creates an ISO 8601 timestamp string
     *
     * Internally, this function does not call to Date.toISOString() to ensure universal output
     * across all platforms, even those without a fully functioning Date API.
     *
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
        timestamp += (date.getUTCMonth() + 1 < 10) ? `0${date.getUTCMonth() + 1}-` : `${date.getUTCMonth() + 1}-`;
        timestamp += (date.getUTCDate() < 10) ? `0${date.getUTCDate()}T` : `${date.getUTCDate()}T`;

        timestamp += (date.getUTCHours() < 10) ? `0${date.getUTCHours()}:` : `${date.getUTCHours()}:`;
        timestamp += (date.getUTCMinutes() < 10) ? `0${date.getUTCMinutes()}:` : `${date.getUTCMinutes()}:`;
        timestamp += (date.getUTCSeconds() < 10) ? `0${date.getUTCSeconds()}.` : `${date.getUTCSeconds()}.`;

        // Format the milliseconds
        if(date.getUTCMilliseconds() < 10)
            timestamp += `00${date.getUTCMilliseconds()}`;
        else if(date.getUTCMilliseconds() < 100)
            timestamp += `0${date.getUTCMilliseconds()}`;
        else
            timestamp += date.getUTCMilliseconds();

        timestamp += "Z";

        return timestamp;
    }

    /**
     * Closes file streams
     */
    closeFiles(outCallback, errCallback)
    {
        if(typeof this.outfile !== "undefined")
            this.outfile.end(outCallback);

        if(typeof this.errfile !== "undefined")
            this.errfile.end(errCallback);
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

        let entry = `[${Logger.getTimestamp()}] ${level} ${message}\n`;

        __print(stream, entry);

        if(typeof this.outfile !== "undefined")
        {
            let file = this.outfile;

            if(level != LOG_LEVEL.INFO)
                file = this.errfile;

            __print(file, entry);
        }
    }
};

module.exports = Logger;
