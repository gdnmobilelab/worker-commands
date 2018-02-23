export { fireCommand, registerCommand, addListener, removeListener } from "./command-registry";
import { setup as notificationSetup } from "./commands/notification";
import { setup as clientSetup } from "./commands/client";
import { setup as registrationSetup } from "./commands/registration";
import { setup as pushSetup } from "./push";
import { setup as setupWorker } from "./bridge/worker-side";
export { sendClient as sendCommand } from "./bridge/client-side";
export function setup() {
    notificationSetup();
    clientSetup();
    registrationSetup();
    pushSetup();
    setupWorker();
}
