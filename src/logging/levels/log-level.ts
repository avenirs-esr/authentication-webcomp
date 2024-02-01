
/** Log levels */
export enum LogLevel {
    trace = 1,
    debug = 2,
    info = 3,
    warn = 4,
    error = 5,
    fatal = 6,
    default = 3 
}

/**
 * Converts a log level to its string value and handles the default name.
 * @param {LogLevel} level The level to convert to string
 * @return {String} The string representation of the log level.
 */
export function logLevelToString(level: LogLevel): string {
    if (level === LogLevel.default) {
        return 'info';
    }
    return LogLevel[level];
}