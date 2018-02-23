import { sendCommand } from "../../../";
import { expect } from "chai";
import { waitForMessage } from "../wait-for-message";

async function getNotifications() {
    let reg = await navigator.serviceWorker.getRegistration();
    return reg!.getNotifications();
}

describe("Notifications", function() {
    afterEach(async () => {
        let notifications = await getNotifications();
        notifications.forEach(n => n.close());
    });

    it("can show a notification", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test"
            }
        });

        let notifications = await getNotifications();
        expect(notifications.length).to.equal(1);
        expect(notifications[0].body).to.equal("test");
    });

    it("can close a notification", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification"
            }
        });

        await sendCommand({
            command: "notification.close",
            options: {
                tag: "test-notification"
            }
        });

        let notifications = await getNotifications();
        expect(notifications.length).to.equal(0);
    });

    it("processes click events", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification",
                events: {
                    onclick: {
                        command: "client.post-message",
                        options: {
                            message: {
                                success: true
                            }
                        }
                    }
                }
            }
        });

        await sendCommand({
            command: "dispatch-notification-event",
            options: {
                index: 0,
                type: "notificationclick"
            }
        });

        let value = await waitForMessage();
        expect(value.success).to.equal(true);
    });

    it("processes click-action events", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification",
                actions: [
                    {
                        action: "testaction",
                        title: "test action"
                    }
                ],
                events: {
                    ontestaction: {
                        command: "client.post-message",
                        options: {
                            message: {
                                success: true
                            }
                        }
                    }
                }
            }
        });

        await sendCommand({
            command: "dispatch-notification-event",
            options: {
                index: 0,
                type: "notificationclick",
                action: "testaction"
            }
        });

        let value = await waitForMessage();
        expect(value.success).to.equal(true);
    });

    it("processes close events", async () => {
        await sendCommand({
            command: "notification.show",
            options: {
                body: "test",
                title: "test",
                tag: "test-notification",
                events: {
                    onclose: {
                        command: "client.post-message",
                        options: {
                            message: {
                                success: true
                            }
                        }
                    }
                }
            }
        });

        await sendCommand({
            command: "dispatch-notification-event",
            options: {
                index: 0,
                type: "notificationclose"
            }
        });

        let value = await waitForMessage();
        expect(value.success).to.equal(true);
    });
});
