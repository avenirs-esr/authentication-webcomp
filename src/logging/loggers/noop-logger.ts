import { LogLevel } from '../levels';
import { LoggingContext } from '../models';
import { Logger } from './logger';


/**
 * Noop Logger. Can be ued to disable a Logger of for a temporarly initialization.
 * @date 01/02/2024 - 16:28:19
 * @author A. Deman
 *
 * @export
 * @class NoopLogger
 * @typedef {NoopLogger}
 * @implements {Logger}
 */
export class NoopLogger implements Logger {

   /** Static instance. */
   private static _INSTANCE: NoopLogger;
   
   /** Disabled flag. */
   disabled: boolean = false;

   /** Name of the logger. */
   name = 'nohop';

   /** Level of the logger. */
   level = LogLevel.trace;

   /**
    * Singleton constructor.
    */
   constructor(){

      if (!NoopLogger._INSTANCE){
         NoopLogger._INSTANCE = this;
      }

      return NoopLogger._INSTANCE;
   }

   /** 
    * Logs a message for a specific level. 
    * @param level The level of the message.
    * @param {any[]} messageParts Parts of the message to log.
    * @return {Logger} this instance of Logger.
    * 
    */
   log(level: LogLevel, ...messageParts: any[]): Logger {
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
    * Not the level of logger / message still apply.
    * Does nothing in this implementation.
    * @param predicate The predicate to determine if the log should be processed.
    */
   if(predicate: boolean): Logger {
      return this;
   }

   /**
    * Enter into a context.
    * @param {LoggingContext | string }context A logging context.
    * @returns this instance.
    */
   enter(context: LoggingContext | string): Logger {
      return this;
    }
    
    /**
     * Leave a context.
     * @returns This instance.
     */
    leave(): Logger {
       return this;
    }

}