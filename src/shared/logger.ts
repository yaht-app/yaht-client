import { LOG_FILE_NAME } from '@/config/logger.config';
import ElectronLog from 'electron-log';
import logger from 'electron-log';

const getLogger = (
  loggerName: string,
  background = false
): ElectronLog.LogFunctions => {
  const currentDate = new Date().toISOString().split('T')[0];
  const processName = background
    ? LOG_FILE_NAME.BACKGROUND
    : LOG_FILE_NAME.RENDERER;

  logger.scope(loggerName);
  logger.transports.file.fileName = `${currentDate}-${processName}.log`;
  return logger;
};

export { getLogger };
