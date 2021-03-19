const COLOR = require("./color");

/**
 * @typedef module:log_level.LOG_LEVEL
 *
 * @property {string} INFO
 * @property {string} WARN
 * @property {string} SEVERE
 * @property {string} FATAL
 */
const LOG_LEVEL =
{
    INFO: `${COLOR.FGCYAN}INFO${COLOR.RESET}`,
    WARN: `${COLOR.FGYELLOW}WARN${COLOR.RESET}`,
    SEVERE: `${COLOR.FGRED}SEVERE${COLOR.RESET}`,
    FATAL: `${COLOR.FGRED}${COLOR.BOLD}FATAL${COLOR.RESET}`,
};

module.exports = LOG_LEVEL;
