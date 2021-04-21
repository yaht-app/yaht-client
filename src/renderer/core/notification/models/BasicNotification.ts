export class BasicNotification {
  occurrenceId: number;
  type: 'start' | 'end';
  title: string;
  message: string;
  actions?: any[];
  closeButtonText?: string;
  shown = false;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  skippedAt?: string;
  duration?: number;

  constructor(
    occurrenceId: number,
    type: 'start' | 'end',
    title: string,
    message: string,
    scheduledAt: string,
    closeButtonText: string,
    actions?: any[],
    duration?: number
  ) {
    this.occurrenceId = occurrenceId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.scheduledAt = scheduledAt;
    this.closeButtonText = closeButtonText;
    this.actions = actions;
    this.duration = duration;
  }
}
