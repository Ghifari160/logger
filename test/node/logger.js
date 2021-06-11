const fs = require("fs");
const path = require("path");
const assert = require("assert");

const stream = require("stream");

const outfile = path.resolve(__dirname, "../../outfile.log");
const errfile = path.resolve(__dirname, "../../errfile.log");

/**
 * Simple Duplex Stream
 */
class SimpleDuplex extends stream.Duplex
{
    /**
     * Creates a SimpleDuplex instance
     *
     * @param {Object} options Stream options
     */
    constructor(options)
    {
        super(options);

        this.buffer = "";
        this.pointer_write = 0;
        this.pointer_read = 0;
    }

    _write(chunk, encoding, callback)
    {
        if(Buffer.isBuffer(chunk))
            chunk = chunk.toString();

        this.buffer += chunk;
        this.pointer_write += chunk.length;

        callback();
    }

    _read(size)
    {
        let ret;

        if(typeof size !== "undefined" && (size + this.pointer_read) < this.buffer.length)
            ret = this.buffer.substring(this.pointer_read, size);
        else if(typeof size === "undefined" || (size + this.pointer_read) >= this.buffer.length)
            ret = this.buffer.substring(this.pointer_read);

        this.pointer_read += ret.length;

        this.push(ret);
    }
};

describe("Logger", function()
{
    function getLogger()
    {
        return require("../../lib/node");
    }

    before(function()
    {
        if(fs.existsSync(outfile))
            fs.renameSync(outfile, `${outfile}.old`);

        if(fs.existsSync(errfile))
            fs.renameSync(errfile, `${errfile}.old`);
    });

    after(function()
    {
        if(fs.existsSync(`${outfile}.old`))
            fs.renameSync(`${outfile}.old`, outfile);

        if(fs.existsSync(`${errfile}.old`))
            fs.renameSync(`${errfile}.old`, errfile);
    });

    afterEach(function()
    {
        if(fs.existsSync(outfile))
            fs.unlinkSync(outfile);

        if(fs.existsSync(errfile))
            fs.unlinkSync(errfile);
    });

    describe("Library", function()
    {
        it("Exports all sublibraries", function()
        {
            let Logger = getLogger();

            assert.ok(Logger.hasOwnProperty("COLOR"), "Logger does not contain the COLOR property.");
            assert.deepStrictEqual(Logger.COLOR, require("../../lib/node/color"), "Logger.COLOR is not equal to color.js");
            assert.ok(Logger.hasOwnProperty("LOG_LEVEL"), "Logger does not contain the LOG_LEVEL property.");
            assert.deepStrictEqual(Logger.LOG_LEVEL, require("../../lib/node/log-level"), "Logger.LOG_LEVEL is not equal to log-level.js");
        });

        describe("#getTimestamp()", function()
        {
            it("Exported by the library", function()
            {
                let Logger = getLogger();

                assert.ok(Logger.hasOwnProperty("getTimestamp"), "Logger does not contain the getTimestamp property.");
                assert.ok(typeof Logger.getTimestamp === "function", "Logger.getTimestamp is not a function.");
            });

            // Do not test years < 1583. ISO 8601 does not allow for years < 1583 without prior
            // agreement between the recipent and transmitter. Where prior agreement exists, the
            // years would be formatted with an extended (+/-)YYYYY format.
            let tests = [
                {
                    id: "Creates a valid ISO 8601 timestamp string for numbers < 10",
                    year: 1583,
                    month: 5,
                    day: 5,
                    hours: 5,
                    minutes: 5,
                    seconds: 5,
                    milliseconds: 5,
                },
                {
                    id: "Creates a valid ISO 8601 timestamp string for numbers < 100",
                    year: 1583,
                    month: 11,
                    day: 12,
                    hours: 12,
                    minutes: 12,
                    seconds: 12,
                    milliseconds: 12,
                },
                {
                    id: "Creates a valid ISO 8601 timestamp string for numbers < 1000",
                    year: 1583,
                    month: 11,
                    day: 12,
                    hours: 12,
                    minutes: 12,
                    seconds: 12,
                    milliseconds: 120,
                },
                {
                    id: "Creates a valid ISO 8601 timestamp string for numbers > 1000",
                    year: 1583,
                    month: 11,
                    day: 12,
                    hours: 12,
                    minutes: 12,
                    seconds: 12,
                    milliseconds: 120,
                },
                {
                    id: "Properly handles zeroes",
                    year: 1583,
                    month: 0,
                    day: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0,
                },
                {
                    id: "Properly handles overbound numbers",
                    year: 2021,
                    month: 12,
                    day: 40,
                    hours: 30,
                    minutes: 70,
                    seconds: 70,
                    milliseconds: 1000,
                },
            ];

            tests.forEach(({ id, year, month, day, hours, minutes, seconds, milliseconds }) =>
            {
                it(id, function()
                {
                    let Logger = getLogger();

                    let date = new Date();

                    date.setUTCFullYear(year);
                    date.setUTCMonth(month);
                    date.setUTCDate(day);

                    date.setUTCHours(hours);
                    date.setUTCMinutes(minutes);
                    date.setUTCSeconds(seconds);

                    date.setUTCMilliseconds(milliseconds);

                    let expected = date.toISOString();
                    let actual = Logger.getTimestamp(date);

                    assert.strictEqual(actual, expected, "Generated timestamp does not match expected values.");
                });
            });
        });
    });

    describe("#constructor()", function()
    {
        function commonAsserts(logger, Logger)
        {
            assert.ok(logger instanceof Logger, "Constructed object is not an instance of Logger.");
        }

        it("Creates a valid Logger instance from no parameters", function()
        {
            let Logger = getLogger();

            let logger = new Logger();

            commonAsserts(logger, Logger);
        });

        it("Creates a valid Logger instance with outStream specified", function()
        {
            let Logger = getLogger();

            let outStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

            let logger = new Logger(outStream);

            commonAsserts(logger, Logger);
        });

        it("Creates a valid Logger instance with outStream and errStream specified", function()
        {
            let Logger = getLogger();

            let outStream = new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });
            let errStream = new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

            let logger = new Logger(outStream, errStream);

            commonAsserts(logger, Logger);
        });

        it("Creates a valid Logger instance with outStream, errStream, and outFile specified", function()
        {
            let Logger = getLogger();

            let outStream = new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });
            let errStream = new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

            let outFile = "outfile.log";

            let logger = new Logger(outStream, errStream, outFile);

            commonAsserts(logger, Logger);
        });

        it("Creates a valid Logger instance with outStream, errStream, outFile, and errFile specified", function()
        {
            let Logger = getLogger();

            let outStream = new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });
            let errStream = new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

            let outFile = "outfile.log";
            let errFile = "errfile.log";

            let logger = new Logger(outStream, errStream, outFile, errFile);

            commonAsserts(logger, Logger);
        });
    });

    describe("#log()", function()
    {
        let tests = [
            {
                id: "Logs INFO",
                expected: "\x1b[36mINFO\x1b[0m This is an INFO entry.\n",
                level: getLogger().LOG_LEVEL.INFO,
                logStream: "stdout",
                input: "This is an INFO entry.",
            },
            {
                id: "Logs WARN",
                expected: "\x1b[33mWARN\x1b[0m This is a WARN entry.\n",
                level: getLogger().LOG_LEVEL.WARN,
                logStream: "stderr",
                input: "This is a WARN entry.",
            },
            {
                id: "Logs SEVERE",
                expected: "\x1b[31mSEVERE\x1b[0m This is a SEVERE entry.\n",
                level: getLogger().LOG_LEVEL.SEVERE,
                logStream: "stderr",
                input: "This is a SEVERE entry.",
            },
            {
                id: "Logs FATAL",
                expected: "\x1b[31m\x1b[91mFATAL\x1b[0m This is a FATAL entry.\n",
                level: getLogger().LOG_LEVEL.FATAL,
                logStream: "stderr",
                input: "This is a FATAL entry.",
            },
        ];

        describe("outStream_specified", function()
        {
            tests.forEach(({ id, expected, level, input }) =>
            {
                it(id, function()
                {
                    let Logger = getLogger();

                    let outStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

                    let logger = new Logger(outStream);

                    logger.log(level, input);

                    let actual = outStream.read();
                    actual = actual.toString().substring(27);

                    assert.strictEqual(actual, expected, "Generated log entry does not match expected values.");
                });
            });
        });

        describe("outStream_errStream_specified", function()
        {
            tests.forEach(({ id, expected, level, logStream, input }) =>
            {
                it(id, function()
                {
                    let Logger = getLogger();

                    let outStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });
                    let errStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

                    let logger = new Logger(outStream, errStream);

                    logger.log(level, input);

                    let actual;

                    if(logStream == "stdout")
                        actual = outStream.read();
                    else
                        actual = errStream.read();

                    actual = actual.toString().substring(27);

                    assert.strictEqual(actual, expected, "Generated log entry does not match expected values.");
                });
            });
        });

        describe("outStream_errStream_outFile_specified", function()
        {
            tests.forEach(({ id, expected, level, logStream, input }) =>
            {
                it(id, function(done)
                {
                    let Logger = getLogger();

                    let outStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });
                    let errStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

                    let outFile = outfile;

                    let logger = new Logger(outStream, errStream, outFile);

                    logger.log(level, input);

                    let actual;

                    if(logStream == "stdout")
                        actual = outStream.read();
                    else
                        actual = errStream.read();

                    actual = actual.toString().substring(27);

                    assert.strictEqual(actual, expected, "Generated stream log entry does not match expected values.");

                    logger.closeFiles(function()
                    {
                        actual = fs.readFileSync(outFile);
                        actual = actual.toString().substring(27);

                        assert.strictEqual(actual, expected, "Generated file log entry does not match expected values.");
                        done();
                    });
                });
            });
        });

        describe("outStream_errStream_outFile_errFile_specified", function()
        {
            tests.forEach(({ id, expected, level, logStream, input }) =>
            {
                it(id, function(done)
                {
                    let Logger = getLogger();

                    let outStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });
                    let errStream =  new SimpleDuplex({ encoding: "utf8", defaultEncoding: "utf8" });

                    let outFile = outfile;
                    let errFile = errfile;

                    let logger = new Logger(outStream, errStream, outFile, errFile);

                    logger.log(level, input);

                    let actual;

                    if(logStream == "stdout")
                        actual = outStream.read();
                    else
                        actual = errStream.read();

                    actual = actual.toString().substring(27);

                    assert.strictEqual(actual, expected, "Generated stream log entry does not match expected values.");

                    if(logStream == "stdout")
                    {
                        logger.closeFiles(function()
                        {
                            actual = fs.readFileSync(outFile);
                            actual = actual.toString().substring(27);

                            assert.strictEqual(actual, expected, "Generated file log entry does not match expected values.");
                            done();
                        });
                    }
                    else
                    {
                        logger.closeFiles(function() {}, function()
                        {
                            actual = fs.readFileSync(errFile);
                            actual = actual.toString().substring(27);

                            assert.strictEqual(actual, expected, "Generated file log entry does not match expected values.");
                            done();
                        });
                    }
                });
            });
        });
    });
});
