import ElectronLog from 'electron-log';
import logger from 'electron-log';

const getLogger = (loggerName: string): ElectronLog.LogFunctions => {
  return logger.scope(loggerName);
};

export { getLogger };
