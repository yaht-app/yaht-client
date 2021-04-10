import { DateTime } from 'luxon';

export class BasicNotification {
  title: string;
  message: string;
  actions?: any[];
  shown: boolean;
  scheduledAt: DateTime;
  startedAt: number;
  endedAt: number;
  skippedAt: number;

  constructor(
    title: string,
    message: string,
    actions: any[],
    shown: boolean,
    scheduledAt: DateTime,
    startedAt: number,
    endedAt: number,
    skippedAt: number
  ) {
    this.title = title;
    this.message = message;
    this.actions = actions;
    this.shown = shown;
    this.scheduledAt = scheduledAt;
    this.startedAt = startedAt;
    this.endedAt = endedAt;
    this.skippedAt = skippedAt;
  }
}
