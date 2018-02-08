export interface RunCommand {
  command: string;
  options?: { [id: string]: any };
  event?: NotificationEvent;
}
