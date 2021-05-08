import { LOG_PATH } from '@/shared/logger';
import { app, BrowserWindow, Menu, shell } from 'electron';

export class WindowMenu {
  private readonly template: Menu;

  constructor(public mainWindow: BrowserWindow) {
    this.template = Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [
          {
            label: 'About yaht-client',
            click: async () => {
              await shell.openExternal('https://yaht.app');
            },
          },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' },
        ],
      },
      {
        label: 'Develop',
        submenu: [
          {
            label: 'Open Logs',
            click: async (): Promise<void> => {
              await shell.openExternal(`file://${LOG_PATH}`);
            },
          },
          {
            type: 'separator',
          },
        ],
      },
    ]);
  }

  public setAppMenu(): void {
    Menu.setApplicationMenu(this.template);
  }
}
