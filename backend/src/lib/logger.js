import { ENV } from "./env.js";

export const createLogger = (systemName, isMajor = false) => {
  const isMajorEnabled = ENV.LOG_MAJOR;
  const isMinorEnabled = ENV.LOG_MINOR;

  const shouldLog = isMajor ? isMajorEnabled : isMinorEnabled;

  return {
    log: (...args) => {
      if (shouldLog) {
        console.log(`[${systemName}]`, ...args);
      }
    },
    error: (...args) => {
      // Errors always log
      console.error(`[${systemName}] [ERROR]`, ...args);
    },
    warn: (...args) => {
      if (shouldLog) {
        console.warn(`[${systemName}] [WARN]`, ...args);
      }
    }
  };
};
