import { LogMessage } from "../models";
import { LogAppender } from "./log-appender";

/**
 * Noop Appender.
 * This appender does nothing and can be used to disable temporarly appending.
 * @date 01/02/2024 - 16:14:56
 * @author A. Deman
 *
 * @export
 * @class NoopAppender
 * @typedef {NoopAppender}
 * @implements {LogAppender}
 */
export class NoopAppender implements LogAppender {
    /**
     * Appends a message.
     * @param message The message to append.
     * @returns false as all the messages a ignored.
     */
    append(message: LogMessage): boolean {
        return false;
    }
}

