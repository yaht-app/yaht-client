import { BrowserWindow, screen } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

export class ReflectionWindowService {
  private window?: Electron.BrowserWindow;
  private webContents?: Electron.WebContents;
  readonly application: Electron.App;

  constructor(application: Electron.App) {
    this.application = application;
  }

  public async createWindow(): Promise<void> {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    const windowPadding = 20;
    this.window = await new BrowserWindow({
      width: 500,
      height: 250,
      x: width - 500 - windowPadding,
      y: 20 + windowPadding,
      show: false,
      titleBarStyle: 'hidden',
      alwaysOnTop: true,
      visualEffectState: 'inactive',
      closable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      resizable: false,

      webPreferences: {
        // Required for Spectron testing
        enableRemoteModule: true,
        nodeIntegration: true,
      },
    });
    this.webContents = this.window.webContents;

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await this.window.loadURL(
        `${process.env.WEBPACK_DEV_SERVER_URL}/#/reflection-notification`
      );
      if (!process.env.IS_TEST)
        this.window.webContents.openDevTools({ mode: 'detach' });
    } else {
      createProtocol('app');
      // Load the index.html when not in development
      await this.window.loadURL('app:// ./index.html#reflection-notification');
    }
  }

  public async showWindow(): Promise<void> {
    if (this.window) {
      await this.window.setVisibleOnAllWorkspaces(true);
      await this.window.show();
    }
  }
}
