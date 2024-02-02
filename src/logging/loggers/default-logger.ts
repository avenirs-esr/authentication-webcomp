import { NoopLogger } from './noop-logger';
import { LogAppender } from '../appenders';
import { LogFormatter } from '../formatters';
import { LogLevel } from '../levels';
import { Logger } from './logger';
import { LoggingContext } from '../models';

/**
 * Default implementation of a Logger.
 * @date 01/02/2024 - 16:21:47
 * @author A. Deman
 *
 * @export
 * @class DefaultLogger
 * @type {DefaultLogger}
 * @implements {Logger}
 */
export class DefaultLogger implements Logger {

   /** The context stacks of the logger. */
   private _contexts: LoggingContext[] = [];

   /** Flag to determine if the logger is disabled. */
   disabled = false;

   /**
    * Builds an instance of logger.
    * @param name  The name of the logger.
    * @param level The level of the logger.
    * @param _formatter  the formatter to use.
    * @param _appender The appender to use.
    */
   constructor(public name: string, public level: LogLevel, private _formatter: LogFormatter, private _appender: LogAppender) {
   }

   /** 
    * Logs a message for a specific level. 
    * @param level The level of the message.
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    */
   log(level: LogLevel, messageParts: any[]): Logger {
      if (level >= this.level && !this.disabled) {
         this._appender.append(this._formatter.format(this.name, level, messageParts, this._contexts?.[this._contexts.length - 1]));
      }
      return this;
   }

   /** 
   * Logs a trace message. 
   * @param {any[]} messageParts Parts of the message to log.
   * @return {Logger} this instance of Logger.
   */
   trace(...messageParts: any[]): Logger {
      return this.log(LogLevel.trace, messageParts);
   }

   /** 
    * Logs a debug message. 
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    */
   debug(...messageParts: any[]): Logger {
      return this.log(LogLevel.debug, messageParts);
   }

   /** 
    * Logs an info message. 
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    */
   info(...messageParts: any[]): Logger {
      return this.log(LogLevel.info, messageParts);
   }

   /** 
   * Logs a warn message. 
   * @param {any[]} messageParts Parts of the message to log.
   * @return {Logger} this instance of Logger.
   */
   warn(...messageParts: any[]): Logger {
      return this.log(LogLevel.warn, messageParts);
   }

   /** 
   * Logs an error message. 
   * @param {any[]} messageParts Parts of the message to log.
   * @return {Logger} this instance of Logger.
   */
   error(...messageParts: any[]): Logger {
      return this.log(LogLevel.error, messageParts);
   }

   /** 
   * Logs a fatal message. 
   * @param {any[]} messageParts Parts of the message to log.
   * @return {Logger} this instance of Logger.
   */
   fatal(...messageParts: any[]): Logger {
      return this.log(LogLevel.fatal, messageParts);
   }

   /**
    * Helper method to process or ignore a message based on a predicate.
    * Note that the level of logger / message still apply if the predicate is true.
    * @param predicate The predicate to determine if the log should be processed.
    * @return this instance if the predicate is true, a noop logger otherwise.
    */
   if(predicate: boolean): Logger {
      return predicate ? this : new NoopLogger();
   }

   /**
    * Enter into a logging context.
    * @param {LoggingContext | string }context The new current context or the source (equivalent to {source:...}).
    */
   enter(context: LoggingContext | string): Logger {
      this._contexts.push( typeof context === "string"? {source: context}: context);
      return this;
   }

  /**
   * Leave a logging context.
   */
  leave(): Logger {
      this._contexts.pop();
      return this;
   }

}