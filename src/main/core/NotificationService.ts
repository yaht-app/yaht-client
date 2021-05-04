import { BasicNotification } from '@/renderer/core/notification/models/BasicNotification';
import { getLogger } from '@/shared/logger';
import { CronJob } from 'cron';
import { Notification, shell, WebContents } from 'electron';
import { LogFunctions } from 'electron-log';
import { DateTime } from 'luxon';

const LOG: LogFunctions = getLogger('NotificationService');

export class NotificationService {
  private readonly cronJob: CronJob;
  private webContents!: WebContents;
  private userBasicNotifications: BasicNotification[] = [];
  private shownNotifications: Notification[] = [];

  constructor() {
    this.cronJob = new CronJob('*/1 * * * * *', async () => {
      try {
        LOG.silly('Running checkAndTriggerNotifications');
        this.checkAndTriggerNotifications();
      } catch (e) {
        LOG.error(e);
      }
    });
  }

  public setBasicNotifications(basicNotifications: BasicNotification[]): void {
    LOG.debug(
      `Setting BasicNotifications, length=${basicNotifications.length}`
    );
    if (!this.webContents) {
      LOG.error(`BasicNotifications was set before setting WebContents!`);
      return;
    }
    this.userBasicNotifications = basicNotifications;
    if (basicNotifications.length > 0) {
      this.cronJob.start();
    }

    LOG.debug(
      `BasicNotifications contain ${this.getReflectionNotificationCount()} notifications of type reflection.`
    );
  }

  public stopService(): void {
    this.cronJob.stop();
  }

  public setWebContents(webContents: WebContents): void {
    this.webContents = webContents;
  }

  private checkAndTriggerNotifications(): void {
    const nextScheduledNotification = this.getNextScheduledNotification();
    if (nextScheduledNotification) {
      LOG.debug(
        `Next notification scheduled at: ${nextScheduledNotification.scheduledAt.toString()}`
      );
    } else {
      LOG.debug('No notification scheduled');
    }

    const dueNotifications = this.getDueNotifications();
    dueNotifications.forEach((n) => {
      n.shown = true;
      this.createAndShowNotification(n);
    });
  }

  private createAndShowNotification(
    basicNotification: BasicNotification
  ): void {
    const nativeNotification = this.createNotificationFromBasicNotification(
      basicNotification
    );
    this.attachListenersToNotification(basicNotification, nativeNotification);
    this.shownNotifications.push(nativeNotification);

    nativeNotification.show();
  }

  private attachListenersToNotification(
    basicNotification: BasicNotification,
    nativeNotification: Notification
  ): void {
    nativeNotification.on('close', () => {
      LOG.log(
        `Close event received from notification. Type: ${basicNotification.type}`
      );
      if (basicNotification.type === 'start') {
        LOG.info(`handleStartedNotification`);
        this.handleStartedNotification(basicNotification);
      } else if (basicNotification.type === 'end') {
        LOG.info(`handleEndedNotification`);
        this.handleEndedNotification(basicNotification);
      }
    });
    if (basicNotification.type === 'start') {
      nativeNotification.on('action', (event, index: number) => {
        LOG.log(
          'Action received from notification: ',
          nativeNotification.actions[index]
        );
        this.handleSkippedNotification(basicNotification);
      });
    }
    if (basicNotification.type === 'reflection') {
      nativeNotification.on('click', () => {
        shell.openExternal('https://yaht.app/reflections/new');
        LOG.log('Reflection notification was clicked...');
      });
    }
  }

  private handleStartedNotification(notification: BasicNotification) {
    notification.startedAt = DateTime.now().toString();
    this.userBasicNotifications.push(
      new BasicNotification(
        'End',
        'end',
        notification.title,
        `End ${notification.title} now`,
        DateTime.now().plus({ minutes: notification.duration }).toString(),
        notification.occurrenceId
      )
    );
    this.webContents.send('notification-started', notification);
  }

  private handleEndedNotification(notification: BasicNotification) {
    LOG.debug('handleEndedNotification called');
    notification.endedAt = DateTime.now().toString();
    this.webContents.send('notification-ended', notification);
  }

  private handleSkippedNotification(notification: BasicNotification) {
    LOG.debug('handleSkippedOccurrence called');
    notification.skippedAt = DateTime.now().toString();
    this.webContents.send('notification-skipped', notification);
  }

  private createNotificationFromBasicNotification(
    basicNotification: BasicNotification
  ): Notification {
    LOG.info(`Created native Notification(${basicNotification.title})`);
    return new Notification({
      title: basicNotification.title,
      body: basicNotification.message,
      actions: basicNotification.actions,
      closeButtonText: basicNotification.closeButtonText,
    });
  }

  private isNotificationWithinTime(dateTime: DateTime): boolean {
    return (
      dateTime.diffNow('seconds').seconds <= 2 &&
      dateTime.diffNow('seconds').seconds >= -2
    );
  }

  private getDueNotifications(): BasicNotification[] {
    return this.userBasicNotifications.filter((basicNotification) => {
      return (
        !basicNotification.shown &&
        this.isNotificationWithinTime(
          DateTime.fromISO(basicNotification.scheduledAt)
        )
      );
    });
  }

  private getReflectionNotificationCount(): number {
    return this.userBasicNotifications.filter((n) => n.type === 'reflection')
      .length;
  }

  private getNextScheduledNotification(): BasicNotification {
    let nextNotification: any = null;
    this.userBasicNotifications.forEach((n) => {
      const now = DateTime.now();
      if (DateTime.fromISO(n.scheduledAt) >= now) {
        if (!nextNotification) {
          nextNotification = n;
        }
        if (
          DateTime.fromISO(n.scheduledAt) <=
          DateTime.fromISO(nextNotification.scheduledAt)
        ) {
          nextNotification = n;
        }
      }
    });
    return nextNotification;
  }
}
