import AppUpdater from '@/main/AppUpdater';
import { WindowMenu } from '@/main/WindowMenu';
import { getLogger, LOG_PATH } from '@/shared/logger';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItem,
  nativeImage,
  shell,
  Tray,
} from 'electron';
import { LogFunctions } from 'electron-log';
import path from 'path';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

export class Bootstrap {
  public mainWindow!: Electron.BrowserWindow;
  public webContents!: Electron.WebContents;
  private windowMenu!: WindowMenu;
  private tray!: Electron.Tray;
  private updater: AppUpdater = new AppUpdater();
  private readonly LOG: LogFunctions = getLogger('Bootstrap');
  private readonly isDevelopment: boolean =
    process.env.NODE_ENV === 'development';
  private readonly assetsPath = this.isDevelopment
    ? './src/resources'
    : path.join(process.resourcesPath, 'resources');

  public ready: () => Promise<void> = async () => {
    this.LOG.info(`App ready, running version ${app.getVersion()}`);
    try {
      await this.createWindow();
    } catch (e) {
      this.LOG.error(e);
    }
  };

  private async createWindow(): Promise<void> {
    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      width: 400,
      height: 600,
      webPreferences: {
        // Required for Spectron testing
        enableRemoteModule: true,
        nodeIntegration: true,
      },
    });
    this.webContents = this.mainWindow.webContents;

    if (this.isDevelopment) {
      // globalShortcut.register('CommandOrControl+R', () =>
      //  this.webContents.reload()
      // );
    }

    this.windowMenu = new WindowMenu(this.mainWindow);
    this.windowMenu.setAppMenu();
    this.createTray();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await this.mainWindow.loadURL(
        process.env.WEBPACK_DEV_SERVER_URL as string
      );
      if (!process.env.IS_TEST) this.mainWindow.webContents.openDevTools();
    } else {
      createProtocol('app');
      // Load the index.html when not in development
      await this.mainWindow.loadURL('app://./index.html');
    }
  }

  private createTray(): void {
    const trayImage = nativeImage.createFromPath(
      `${this.assetsPath}/tray@2x.png`
    );

    this.tray = new Tray(trayImage);

    this.updateTray();
  }

  public updateTray(userName: string | null = null): void {
    const alertImage = nativeImage.createFromPath(
      `${this.assetsPath}/icon@2x.png`
    );
    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        new MenuItem({
          label: userName ? `Logged in as ${userName}` : `Not logged in...`,
          enabled: false,
        }),
        { type: 'separator' },
        new MenuItem({
          label: 'Check for Updates...',
          click: () => {
            this.LOG.info(
              `'Check for Updates...' was clicked, going to call updater.checkForUpdatesAndNotify`
            );
            this.updater.checkForUpdatesAndNotify();
          },
        }),
        new MenuItem({
          label: 'Synchronize...',
          click: async () => {
            try {
              await this.webContents.send('fetch-notifications');
              ipcMain.once(
                'fetch-notifications-answer',
                (event, hasFetchedNotifications) => {
                  dialog.showMessageBox({
                    message:
                      hasFetchedNotifications === true
                        ? 'Successfully synchronized notifications!'
                        : 'Did not fetch notifications!',
                    icon: alertImage,
                  });
                }
              );
            } catch (e) {
              dialog.showMessageBox({
                message: `An error occurred while fetching the notifications: ${e.message}`,
                icon: alertImage,
              });
            }
          },
        }),
        { type: 'separator' },
        new MenuItem({
          label: 'Open Dashboard',
          click: async (): Promise<void> => {
            await shell.openExternal(`https://yaht.app/dashboard`);
          },
        }),
        new MenuItem({
          label: 'Get Help',
          click: async (): Promise<void> => {
            await shell.openExternal(`mailto:help@yaht.app`);
          },
        }),
        { type: 'separator' },
        new MenuItem({
          label: `Version ${app.getVersion()}`,
          enabled: false,
        }),
        new MenuItem({
          label: 'Open Logs',
          click: async (): Promise<void> => {
            await shell.openExternal(`file://${LOG_PATH}`);
          },
        }),
        { type: 'separator' },
        new MenuItem({
          label: 'Quit',
          click: () => {
            app.quit();
          },
        }),
      ])
    );
  }
}
