export interface UpdatedNotification extends Notification {
  // the TS definitions aren't up to date with the latest notification specs
  data?: any;
}

// export class UpdatedNotificationEvent extends NotificationEvent {
//   notification: UpdatedNotification;
// }
