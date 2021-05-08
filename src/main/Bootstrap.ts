import { WindowMenu } from '@/main/WindowMenu';
import { getLogger } from '@/shared/logger';
import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  MenuItem,
  nativeImage,
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
  private readonly LOG: LogFunctions = getLogger('Bootstrap');
  private readonly isDevelopment: boolean =
    process.env.NODE_ENV === 'development';
  private readonly assetsPath = this.isDevelopment
    ? './src/resources'
    : path.join(process.resourcesPath, 'resources');

  public ready: () => Promise<void> = async () => {
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
      globalShortcut.register('CommandOrControl+R', () =>
        this.webContents.reload()
      );
    }

    this.windowMenu = new WindowMenu(this.mainWindow);
    this.windowMenu.setAppMenu();
    this.setTray();

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

  private setTray(): void {
    const trayImage = nativeImage.createFromPath(
      `${this.assetsPath}/tray@2x.png`
    );
    const alertImage = nativeImage.createFromPath(
      `${this.assetsPath}/icon@2x.png`
    );
    this.tray = new Tray(trayImage);

    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        new MenuItem({
          label: 'Check for Updates',
          click: () => {
            dialog.showMessageBox({
              message: 'No updates available',
              icon: alertImage,
            });
          },
        }),
        new MenuItem({
          label: 'Sync notifications',
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
