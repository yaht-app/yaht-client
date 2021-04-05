export interface BasicNotification {
  triggerTimeAndDate: number;
  title: string;
  message: string;
  actions?: any[];
  sent: boolean;
}
