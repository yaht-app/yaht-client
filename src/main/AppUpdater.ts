import { getLogger } from '@/shared/logger';
import { autoUpdater } from 'electron-updater';
const LOG = getLogger('AutoUpdater');

export default class AppUpdater {
  private checkForUpdatesInterval: NodeJS.Timeout | undefined;
  constructor() {
    autoUpdater.logger = LOG;
  }

  public async checkForUpdatesAndNotify(): Promise<void> {
    LOG.info(
      'checkForUpdatesAndNotify was called, calling autoUpdater.checkForUpdatesAndNotify'
    );
    try {
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
      LOG.error(`An error occurred while trying to check for updates: ${e}`);
    }
  }

  public startCheckForUpdatesInterval(): void {
    LOG.info('startCheckForUpdatesInterval called, starting interval...');
    this.checkForUpdatesInterval = setInterval(
      this.checkForUpdatesAndNotify,
      30 * 60 * 1000
    );
  }
}
