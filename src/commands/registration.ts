import { registerCommand } from "../command-registry";

declare var self: ServiceWorkerGlobalScope;

async function update() {
  await self.registration.update();
}

async function unregister() {
  await self.registration.unregister();
}

export function setup() {
  registerCommand("registration.update", update);
  registerCommand("registration.unregister", unregister);
}
