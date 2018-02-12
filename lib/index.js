export { fireCommand, registerCommand } from "./command-registry";
import { setup as notificationSetup } from "./commands/notification";
import { setup as clientSetup } from "./commands/client";
import { setup as registrationSetup } from "./commands/registration";
import { setup as pushSetup } from "./push";
export function setup() {
    notificationSetup();
    clientSetup();
    registrationSetup();
    pushSetup();
}
