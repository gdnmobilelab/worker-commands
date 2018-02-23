export { fireCommand, registerCommand, addListener, removeListener } from "./command-registry";
export { ShowNotification, NotificationAction, RemoveNotificationOptions } from "./commands/notification";
export { RunCommand } from "./interfaces/run-command";
export { sendClient as sendCommand } from "./bridge/client-side";
export declare function setup(): void;
