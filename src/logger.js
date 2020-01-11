/*
 * Logger.js
 *
 * Copyright (C) 2019 Ofry <Ofryli@gmail.com>
 * https://gist.github.com/OfryL/c4fe38bfed4bf016591ab643f6aad1bb
 *
 * Logger is free software.
 *
 * You may redistribute it and/or modify it under the terms of the
 * GNU General Public License, as published by the Free Software
 * Foundation; either version 3 of the License, or (at your option)
 * any later version.
 *
 * Logger is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */
const sysDebugger = require('util');
const sysLogger = console;

const CREATINGNEWLOGGER = 'Creating new console logger';
const style = {
    'info': {'title': "info", 'colorCode': 34},
    'warn': {'title': "warn", 'colorCode': 33},
    'error': {'title': "error", 'colorCode': 31},
    'debug': {'title': "debug", 'colorCode': 47}
};

const getFormatHeader = function (namespace,lvl,colorCode) {
    let time = new Date().toLocaleString();
    return `[${time}] [${namespace}] \x1b[${colorCode}m[${lvl}]\x1b[0m `;
};

function Logger(namespace) {
    this.debugger = sysDebugger.debuglog(namespace);
    this.loggerName = namespace;
}

Logger.prototype.log = function (message, ...optionalParams) {
    sysLogger.log(getFormatHeader(this.loggerName, style.info.title, style.info.colorCode) + message, ...optionalParams);
};

Logger.prototype.warn = function (message, ...optionalParams) {
    sysLogger.warn(getFormatHeader(this.loggerName, style.warn.title, style.warn.colorCode) + message, ...optionalParams);
};

Logger.prototype.error = function (message, ...optionalParams) {
    sysLogger.error(getFormatHeader(this.loggerName, style.error.title, style.error.colorCode) + message, ...optionalParams);
};

Logger.prototype.debug = function (message, ...optionalParams) {
    this.debugger(getFormatHeader(this.loggerName, style.debug.title, style.debug.colorCode) + message, ...optionalParams);
};

const initLogger = function (namespace){
    let logger = new Logger(namespace);
    logger.debug(CREATINGNEWLOGGER);
    return logger;
};

module.exports = initLogger;