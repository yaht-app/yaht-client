import { DateTime } from 'luxon';

export class BasicNotification {
  type: 'start' | 'end';
  title: string;
  message: string;
  actions?: any[];
  closeButtonText?: string;
  shown = false;
  scheduledAt: DateTime;
  startedAt?: DateTime;
  endedAt?: DateTime;
  skippedAt?: DateTime;
  duration?: number;

  constructor(
    type: 'start' | 'end',
    title: string,
    message: string,
    scheduledAt: DateTime,
    closeButtonText: string,
    actions?: any[],
    duration?: number
  ) {
    this.type = type;
    this.title = title;
    this.message = message;
    this.scheduledAt = scheduledAt;
    this.closeButtonText = closeButtonText;
    this.actions = actions;
    this.duration = duration;
  }
}
