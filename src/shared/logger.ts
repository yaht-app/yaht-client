import { LOG_FILE_NAME, LOG_LEVEL } from '@/config/logger.config';
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
  logger.transports.file.level = LOG_LEVEL.FILE;
  logger.transports.console.level = LOG_LEVEL.CONSOLE;
  return logger;
};

export { getLogger };
