'use strict';

import { Bootstrap } from '@/main/Bootstrap';
import { BasicNotification } from '@/renderer/core/notification/models/BasicNotification';
import { getLogger } from '@/shared/logger';
import {
  app,
  protocol,
  BrowserWindow,
  Notification,
  ipcMain,
  NotificationAction,
} from 'electron';
import { DateTime } from 'luxon';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

const isDevelopment = process.env.NODE_ENV !== 'production';
const LOG = getLogger('app.ts', true);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

const system: Bootstrap = new Bootstrap();

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
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

let notifications: BasicNotification[];
let notificationInterval: NodeJS.Timeout;

ipcMain.on('logout', () => {
  clearInterval(notificationInterval);
});
ipcMain.on('notifications', (event, newNotifications) => {
  LOG.log(`Received notifications, length: ${newNotifications.length}`);
  notifications = newNotifications;
  notificationInterval = setInterval(() => handleNotificationInterval(), 1000);
});

function handleNotificationInterval() {
  notifications.forEach((n) => {
    const now = DateTime.now();
    if (n.triggerTimeAndDate <= now.toMillis() && !n.sent) {
      n.sent = true;
      sendNotification(n.title, n.message, n.actions);
    } else {
      LOG.debug(`Skipping BasicNotification ${n.title}`);
    }
  });
}

function sendNotification(
  title: string,
  message: string,
  actions?: NotificationAction[]
) {
  const notification = new Notification({
    title: title,
    body: message,
    actions: actions,
  });
  notification.on('action', (event, index: number) => {
    LOG.log(notification.actions[index]);
  });
  notification.show();
}
