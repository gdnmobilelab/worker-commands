import { fireCommand } from "../command-registry";
import { RunCommand } from "../interfaces/run-command";
import { PAYLOAD_KEY } from "./client-side";

export function setup() {
  self.addEventListener("message", async event => {
    // Not sure why we can't specify this above, but TypeScript barfs if we do
    let e = event as MessageEvent;

    if (!e.data || !e.data[PAYLOAD_KEY]) {
      return;
    }

    const returnPort = e.ports[0] as MessagePort | undefined;

    if (!returnPort) {
      throw new Error("Send worker command payload with no reply port");
    }

    try {
      let result = await fireCommand(e.data[PAYLOAD_KEY]);
      returnPort.postMessage([null, result]);
    } catch (err) {
      returnPort.postMessage([err.message, null]);
    }
  });
}
