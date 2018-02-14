import { registerCommand, fireCommand } from "../command-registry";
import { RunCommand } from "../interfaces/run-command";
import { UpdatedNotification } from "../interfaces/updated-notification";

declare var self: ServiceWorkerGlobalScope;

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
  events?: { [name: string]: RunCommand<any> | RunCommand<any>[] };
}

export interface RemoveNotificationOptions {
  tag?: string;
}

async function showNotification(options: ShowNotification) {
  if (!options.title || !options.body) {
    throw new Error("Notification must, at at a minimum, provide title and body.");
  }

  // The showNotification command separates title from the rest of the options,
  // so we'll oblige
  const { title, events, ...nonTitleOptions } = options;

  nonTitleOptions.data = Object.assign(nonTitleOptions.data || {}, {
    // We add this so that when we're looking at notificationclick etc. events
    // we can check whether this is a notification generated by this library
    // or not.
    __workerCommandNotification: true,
    __events: events
  });

  await self.registration.showNotification(title, nonTitleOptions);
}

async function removeNotifications(
  removeOptions?: RemoveNotificationOptions,
  event?: NotificationEvent
) {
  let tag = removeOptions ? removeOptions.tag : undefined;

  if (!tag && event) {
    event.notification.close();
  } else if (!tag) {
    throw new Error("Must provide a notificationevent or tag to remove notification");
  }

  let currentNotifications = await self.registration.getNotifications({ tag });

  currentNotifications.forEach((n: UpdatedNotification) => {
    if (checkIfLibraryNotification(n) === true) {
      n.close();
    }
  });
}

async function processNotificationClick(empty: void, e: NotificationEvent | undefined) {
  if (!e) {
    throw new Error("Cannot process notification click without also sending event");
  }

  let notification = e.notification as UpdatedNotification;
  if (checkIfLibraryNotification(notification) === false) {
    // This notification was not generated by our library, so ignore it.
    return;
  }

  if (!notification.data.__events) {
    // This notification does not have any event listeners.
    console.warn("Notification received a click event but has no events attached.");
    return;
  }

  let eventName = "click";
  if (e.action) {
    eventName = e.action;
  }

  let targetEvent = notification.data.__events["on" + eventName];

  if (!targetEvent) {
    console.error(`Notification received on${eventName} event, but no listener was attached`);
    return;
  }

  await fireCommand(targetEvent, e);
}

async function processNotificationClose(empty: void, e: NotificationEvent | undefined) {
  if (!e) {
    throw new Error("Cannot process notification click without also sending event");
  }
  let notification = e.notification as UpdatedNotification;
  if (checkIfLibraryNotification(notification) === false) {
    // This notification was not generated by our library, so ignore it.
    return;
  }

  if (!notification.data.__events || !notification.data.__events.onclose) {
    // Only 'info' level here because it isn't necessarily a mistake.
    console.info("Notification received a close event with no events attached.");
    return;
  }

  await fireCommand(notification.data.__events.onclose, e);
}

function checkIfLibraryNotification(notification: UpdatedNotification) {
  // We don't want to mess with any notifications not sent through this
  // library - so we can do this simple check:
  return notification.data && notification.data.__workerCommandNotification === true;
}

export function setup() {
  registerCommand("notification.show", showNotification);
  registerCommand("notification.close", removeNotifications);
  registerCommand("notification.process-click", processNotificationClick);
  registerCommand("notification.process-close", processNotificationClose);

  // We have these set up as specific commands so that we can attach listeners
  // for things like analytics later on.

  self.addEventListener("notificationclick", function(e) {
    e.waitUntil(fireCommand({ command: "notification.process-click" }, e));
  });

  self.addEventListener("notificationclose", function(e) {
    e.waitUntil(fireCommand({ command: "notification.process-close" }, e));
  });
}
