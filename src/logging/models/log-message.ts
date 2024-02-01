import { LogLevel } from "../levels";
import { LoggingContext } from "./logging-context";


/**
 * Log message.
 * @date 01/02/2024 - 16:30:38
 * @author A. Deman
 *
 * @export
 * @interface LogMessage
 * @typedef {LogMessage}
 */
export interface LogMessage {
    level: LogLevel,
    prefix: string,
    date: Date;
    parts: any[],
    formatted?: string;
    context?: LoggingContext;
}