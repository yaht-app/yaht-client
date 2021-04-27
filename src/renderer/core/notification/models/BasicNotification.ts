export class BasicNotification {
  type: 'start' | 'end' | 'reflection';
  title: string;
  message: string;
  closeButtonText?: string;
  shown = false;
  scheduledAt: string;
  actions?: any[];
  occurrenceId?: number;
  startedAt?: string;
  endedAt?: string;
  skippedAt?: string;
  duration?: number;

  constructor(
    closeButtonText: string,
    type: 'start' | 'end' | 'reflection',
    title: string,
    message: string,
    scheduledAt: string,
    occurrenceId?: number,
    actions?: any[],
    duration?: number
  ) {
    this.type = type;
    this.title = title;
    this.message = message;
    this.scheduledAt = scheduledAt;
    this.closeButtonText = closeButtonText;
    this.occurrenceId = occurrenceId;
    this.actions = actions;
    this.duration = duration;
  }
}
