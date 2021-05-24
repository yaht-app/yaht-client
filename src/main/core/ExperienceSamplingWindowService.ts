import { ExperienceSample } from '@/renderer/core/experience-sampling/models/ExperienceSample';
import { BrowserWindow, screen } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

export class ExperienceSamplingWindowService {
  private window?: Electron.BrowserWindow;
  private webContents?: Electron.WebContents;

  public async createWindow(): Promise<void> {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    const windowPadding = 20;
    const windowWidth = 500;
    const windowHeight = 130;
    this.window = await new BrowserWindow({
      width: windowWidth,
      height: windowHeight,
      x: width - windowWidth - windowPadding,
      y: 20 + windowPadding,
      show: false,
      opacity: 0,
      frame: false,
      alwaysOnTop: true,
      visualEffectState: 'inactive',
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      resizable: false,
      acceptFirstMouse: true,

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
      if (!process.env.IS_TEST) {
        this.window.webContents.openDevTools({ mode: 'detach' });
      }
    } else {
      createProtocol('app');
      // Load the index.html when not in development
      await this.window.loadURL('app:// ./index.html#experience-notification');
    }
  }

  public async showWindow(experienceSample: ExperienceSample): Promise<void> {
    if (this.window) {
      await this.window.setVisibleOnAllWorkspaces(true);
      this.window.webContents.send('experience-sample', experienceSample);
      let opacity = 0;
      const interval = setInterval(() => {
        if (opacity >= 1) clearInterval(interval);
        this.window!.setOpacity(opacity);
        opacity += 0.1;
      }, 10);
      await this.window.show();
    }
  }
}
