import { LogLevel } from "../levels";
import { LogMessage } from "../models";
import { LogAppender } from "./log-appender";

/**
 * Console appender.
 * @date 01/02/2024 - 16:13:35
 * @author A. Deman
 *
 * @export
 * @class ConsoleAppender
 * @typedef {ConsoleAppender}
 * @implements {LogAppender}
 */
export class ConsoleAppender implements LogAppender {


   
    /**
     * Appends a message to the console.
     * @param message The message to append.
     * @returns True if the message has been processed, false if ignored.
     */
    append(message: LogMessage): boolean {

        switch (message.level) {

            case LogLevel.debug:
            case LogLevel.trace: {
                console.debug(message.prefix, ...message.parts);
                return true;
            }

            case LogLevel.info: {
                console.info(message.prefix, ...message.parts);
                return true;
            }

            case LogLevel.warn: {
                console.warn(message.prefix, ...message.parts);
                return true;
            }

            case LogLevel.error:
            case LogLevel.fatal: {
                console.error(message.prefix, ...message.parts);
                return true;
            }

            default: {
                return false;
            }
        }
    }
}

