import { getLogger } from '@/shared/logger';
import { autoUpdater } from 'electron-updater';
const LOG = getLogger('AutoUpdater');

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = LOG;
  }

  public checkForUpdatesAndNotify(): void {
    autoUpdater.checkForUpdatesAndNotify();
  }
}
