import { UserAuthDTO } from '@/renderer/core/auth/models/UserAuthDTO';
import { BasicNotification } from '@/renderer/core/notification/models/BasicNotification';
import { Occurrence } from '@/renderer/core/occurrence/models/Occurrence';
import { getLogger } from '@/shared/logger';
import { NotificationAction } from 'electron';
import { injectable } from 'inversify';
import { DateTime } from 'luxon';

const LOG = getLogger('NotificationUseCases');

@injectable()
export class NotificationUseCases {
  public createNotificationsFromReflections(
    user: UserAuthDTO
  ): BasicNotification[] {
    let notifications: BasicNotification[] = [];
    if (user.reflection_at.length > 0 && user.reflection_on.length > 0) {
      notifications = this.createNotificationsFromReflectionData(
        user.reflection_at,
        user.reflection_on
      );
    }
    return notifications;
  }

  public createNotificationsFromOccurrences(
    occurrences: Occurrence[]
  ): BasicNotification[] {
    return occurrences.map((o) => {
      const actions: NotificationAction[] = [];
      if (o.habit.is_skippable) {
        actions.push({ text: 'Skip', type: 'button' });
      }
      return new BasicNotification(
        `Start ${o.habit.title}`,
        'start',
        o.habit.title,
        `Start ${o.habit.title} now`,
        o.scheduled_at,
        o.id,
        actions,
        o.habit.duration
      );
    });
  }

  private createNotificationsFromReflectionData(
    atStrings: string[],
    onStrings: string[]
  ): BasicNotification[] {
    const notifications: BasicNotification[] = [];
    onStrings.forEach((weekday) => {
      atStrings.forEach((time) => {
        notifications.push(
          this.createReflectionNotificationFromDateTime(
            this.getDateTimeFromWeekdayAndHour(weekday, time)
          )
        );
      });
    });
    return notifications;
  }

  private getDateTimeFromWeekdayAndHour(
    weekday: string,
    time: string
  ): DateTime {
    const weekdayMap = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };
    const [hour, minute] = time.split(':');

    return DateTime.now().set({
      weekday: (weekdayMap as any)[weekday],
      hour: parseInt(hour),
      minute: parseInt(minute),
      second: 0,
      millisecond: 0,
    });
  }

  private createReflectionNotificationFromDateTime(
    dateTime: DateTime
  ): BasicNotification {
    return new BasicNotification(
      `Skip`,
      'reflection',
      'Reflection',
      `Add your reflection`,
      dateTime.toString(),
      undefined,
      [],
      0
    );
  }
}