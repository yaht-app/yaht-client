/* eslint-disable @typescript-eslint/ban-ts-comment */
'use strict';

import AppUpdater from '@/main/AppUpdater';
import { Bootstrap } from '@/main/Bootstrap';
import { NotificationService } from '@/main/core/NotificationService';
import { ExperienceSamplingWindowService } from '@/main/core/ExperienceSamplingWindowService.ts';
import { getLogger } from '@/shared/logger';
import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

const isDevelopment = process.env.NODE_ENV !== 'production';
const LOG = getLogger('app.ts', true);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

const system: Bootstrap = new Bootstrap();
const updater: AppUpdater = new AppUpdater();
const notificationService = new NotificationService();
const experienceSamplingWindowService = new ExperienceSamplingWindowService();

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') {}
  app.quit();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) system.ready();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      LOG.error('Vue Devtools failed to install:', e.toString());
    }
  }
  await system.ready();
  updater.checkForUpdatesAndNotify();
  notificationService.setWebContents(system.webContents);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.on('logout', () => {
  notificationService.stopService();
});

ipcMain.on('notifications', async (event, notifications) => {
  LOG.log(`Received notifications, length: ${notifications.length}`);
  try {
    notificationService.setBasicNotifications(notifications);
  } catch (e) {
    LOG.error(e);
  }
});

ipcMain.on('setGlobalUser', (event, user) => {
  LOG.debug(`Received user from renderer`);
  // @ts-ignore
  global.user = user;
});
