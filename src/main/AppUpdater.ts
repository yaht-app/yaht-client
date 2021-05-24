import { getLogger } from '@/shared/logger';
import { autoUpdater } from 'electron-updater';
const LOG = getLogger('AutoUpdater');

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = LOG;
  }

  public async checkForUpdatesAndNotify(): Promise<void> {
    try {
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
      LOG.error(`An error occurred while trying to check for updates: ${e}`);
    }
  }
}
