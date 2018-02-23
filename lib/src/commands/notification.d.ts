import { RunCommand } from "../interfaces/run-command";
export interface NotificationAction {
    action: string;
    title: string;
}
export interface ShowNotification {
    title: string;
    badge?: string;
    icon?: string;
    image?: string;
    body: string;
    data?: any;
    tag?: string;
    actions?: NotificationAction[];
    events?: {
        [name: string]: RunCommand<any> | RunCommand<any>[];
    };
}
export interface RemoveNotificationOptions {
    tag?: string;
}
export declare function setup(): void;
