import { WindowMenu } from '@/main/WindowMenu';
import { BrowserWindow, globalShortcut } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

export class Bootstrap {
  public mainWindow!: Electron.BrowserWindow;
  public webContents!: Electron.WebContents;
  private windowMenu!: WindowMenu;

  public ready: () => Promise<void> = async () => {
    await this.createWindow();
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

    if (process.env.NODE_ENV === 'development') {
      globalShortcut.register('CommandOrControl+R', () =>
        this.webContents.reload()
      );
    }

    this.windowMenu = new WindowMenu(this.mainWindow);
    this.windowMenu.setAppMenu();

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
}
