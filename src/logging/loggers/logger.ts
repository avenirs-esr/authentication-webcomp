import { LogLevel } from '../levels';
import { LoggingContext } from '../models';


/**
 * Specification of a Logger.
 * @date 01/02/2024 - 16:23:31
 * @author A. Deman
 *
 * @export
 * @interface Logger
 * @typedef {Logger}
 */
export interface Logger {

    /** Name of the logger. */
    name: string;

    /** Level from which the messages are handled by this logger. */
    level: LogLevel;

    /** Flag to determine if the logger is disabled. */
    disabled: boolean;

    /** 
     * Logs a message for a specific level. 
     * @param {string} level The level of the message.
     * @param {any[]} messageParts Parts of the message to log.
     * @return {Logger} this instance of Logger.
     */
    log(level: LogLevel, messageParts: any[]): Logger;

    /** 
    * Logs a trace message. 
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    */
    trace(...messageParts: any[]): Logger;

    /** 
     * Logs a debug message. 
     * @param {any[]} messageParts Parts of the message to log.
     * @return {Logger} this instance of Logger.
     */
    debug(...messageParts: any[]): Logger;

    /** 
     * Logs an info message. 
     * @param {any[]} messageParts Parts of the message to log.
     * @return {Logger} this instance of Logger.
     */
    info(...messageParts: any[]): Logger;

    /** 
    * Logs a warn message. 
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    */
    warn(...messageParts: any[]): Logger;

    /** 
    * Logs an error message. 
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    */
    error(...messageParts: any[]): Logger;

    /** 
    * Logs a fatal message. 
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    */
    fatal(...messageParts: any[]): Logger;

    /**
     * Helper method to process or ignore a message based on a predicate.
     * Not the level of logger / message still apply.
     * @param {boolean} predicate The predicate to determine if the log should be processed.
     */
    if(predicate: boolean): Logger;

    /**
     * Enter into a logging context.
     * @param {LoggingContext | string }context The new current context or the source (equivalent to {source:...}).
     */
    enter(context: LoggingContext | string):Logger;

    /**
     * Leave a logging context.
     */
    leave(): Logger;
}