import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { BrowserWindow, screen } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

export class ExperienceSamplingWindowService {
  private window?: Electron.BrowserWindow;
  private webContents?: Electron.WebContents;

  public async createWindow(experienceSample: ExperienceSample): Promise<void> {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    const windowPadding = 20;
    const windowWidth = 450;
    const windowHeight = 120;
    this.window = await new BrowserWindow({
      width: windowWidth,
      height: windowHeight,
      x: width - windowWidth - windowPadding,
      y: 20 + windowPadding,
      show: false,
      frame: false,
      alwaysOnTop: true,
      visualEffectState: 'inactive',
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
        `${process.env.WEBPACK_DEV_SERVER_URL}/#/experience-notification`
      );
      if (!process.env.IS_TEST)
        this.window.webContents.openDevTools({ mode: 'detach' });
    } else {
      createProtocol('app');
      // Load the index.html when not in development
      await this.window.loadURL('app:// ./index.html#experience-notification');
      this.webContents!.send('experience-sample', experienceSample);
    }
  }

  public async showWindow(): Promise<void> {
    if (this.window) {
      await this.window.setVisibleOnAllWorkspaces(true);
      await this.window.show();
    }
  }
}
