/**
 * @typedef module:color.COLOR
 *
 * @property {string} RESET
 * @property {string} BRIGHT
 * @property {string} DIM
 * @property {string} UNDERSCORE
 * @property {string} BLINK
 * @property {string} REVERSE
 * @property {string} HIDDEN
 * @property {string} BOLD
 *
 * @property {string} FGBLACK
 * @property {string} FGRED
 * @property {string} FGGREEN
 * @property {string} FGYELLOW
 * @property {string} FGBLUE
 * @property {string} FGMAGENTA
 * @property {string} FGCYAN
 * @property {string} FGWHITE
 *
 * @property {string} BGBLACK
 * @property {string} BGRED
 * @property {string} BGGREEN
 * @property {string} BGYELLOW
 * @property {string} BGBLUE
 * @property {string} BGMAGENTA
 * @property {string} BGCYAN
 * @property {string} BGWHITE
 */
const COLOR =
{
    RESET: "\x1b[0m",
    BRIGHT: "\x1b[1m",
    DIM: "\x1b[2m",
    UNDERSCORE: "\x1b[4m",
    BLINK: "\x1b[5m",
    REVERSE: "\x1b[7m",
    HIDDEN: "\x1b[8m",
    BOLD: "\x1b[91m",

    FGBLACK: "\x1b[30m",
    FGRED: "\x1b[31m",
    FGGREEN: "\x1b[32m",
    FGYELLOW: "\x1b[33m",
    FGBLUE: "\x1b[34m",
    FGMAGENTA: "\x1b[35m",
    FGCYAN: "\x1b[36m",
    FGWHITE: "\x1b[37m",

    BGBLACK: "\x1b[40m",
    BGRED: "\x1b[41m",
    BGGREEN: "\x1b[42m",
    BGYELLOW: "\x1b[43m",
    BGBLUE: "\x1b[44m",
    BGMAGENTA: "\x1b[45m",
    BGCYAN: "\x1b[46m",
    BGWHITE: "\x1b[47m",
};

module.exports = COLOR;
