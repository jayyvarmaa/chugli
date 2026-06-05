export const createLogger = (systemName, isMajor = false) => {
  const isMajorEnabled = import.meta.env.VITE_LOG_MAJOR === 'true';
  const isMinorEnabled = import.meta.env.VITE_LOG_MINOR === 'true';

  const shouldLog = isMajor ? isMajorEnabled : isMinorEnabled;

  return {
    log: (...args) => {
      if (shouldLog) {
        console.log(`[${systemName}]`, ...args);
      }
    },
    error: (...args) => {
      // We generally want to see errors regardless of flags to help debugging, 
      // but we tag them properly
      console.error(`[${systemName}] [ERROR]`, ...args);
    },
    warn: (...args) => {
      if (shouldLog) {
        console.warn(`[${systemName}] [WARN]`, ...args);
      }
    }
  };
};
