import { LogMessage } from '../models';

/**
 * Appends a message to a destination.
 * @date 01/02/2024 - 16:14:20
 * @author A. Deman
 *
 * @export
 * @interface LogAppender
 * @typedef {LogAppender}
 */
export interface LogAppender {
    append(message: LogMessage): boolean;
}