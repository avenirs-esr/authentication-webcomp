import { LogLevel, logLevelToString } from "../levels";
import { LogFormatter } from "./log-formatter";
import { LogMessage, LoggingContext } from "../models";

/**
 * Deffault formatter.
 * @date 01/02/2024 - 16:16:31
 * @author A. Deman
 *
 * @export
 * @class DefaultLogFormatter
 * @type {DefaultLogFormatter}
 * @implements {LogFormatter}
 */
export class DefaultLogFormatter implements LogFormatter {

    /**
     * Format the message.
     * @date 01/02/2024 - 16:17:54
     * @author A. Deman
     *
     * @param {string} name The name of the logger.
     * @param {LogLevel} level Level from which messages are processed by this logger.
     * @param {any[]} messageParts Parts of the message.
     * @param {?LoggingContext} context The context of the log.
     * @returns {LogMessage} An instance of LogMessage.
     */
    format(name: string, level: LogLevel, messageParts: any[], context?: LoggingContext): LogMessage {
        
        const date = new Date();
        
        const message: LogMessage = {
            level,
            date,
            prefix: `[${logLevelToString(level)}::${name}${context?.source ?  '::'+ context.source:''}]`,
            parts: messageParts,
            context
        }
        return message;
    }
}

