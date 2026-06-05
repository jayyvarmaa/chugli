export const createLogger = (systemName, isMajor = false) => {
  const isMajorEnabled = process.env.LOG_MAJOR === 'true';
  const isMinorEnabled = process.env.LOG_MINOR === 'true';

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
