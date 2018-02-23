import { RunCommand } from "../interfaces/run-command";

export const PAYLOAD_KEY = "__workerCommandPayload";

// We're not using async here so that our client lib is as small as possible when
// compiled to ES5

export function sendClient(cmd: RunCommand<any> | RunCommand<any>[]) {
  return window.navigator.serviceWorker.ready.then(reg => {
    if (!reg.active) {
      throw new Error("Received a worker registration but it has no active worker");
    }

    let replyChannel = new MessageChannel();
    let replyPromise = new Promise<any>((fulfill, reject) => {
      replyChannel.port2.onmessage = e => {
        if (!e.data || !(e.data instanceof Array)) {
          reject(new Error("Did not recognise response from worker command call"));
        }

        let [err, response] = e.data;

        if (err) {
          reject(new Error(err));
        } else {
          fulfill(response);
        }
      };
    });

    let msg: any = {};
    msg[PAYLOAD_KEY] = cmd;

    reg.active.postMessage(msg, [replyChannel.port1]);
    return replyPromise;
  });
}

// Putting these in here because the TS compiler doesn't like us including both
// the webworker and dom libraries:

declare interface ServiceWorkerInterface {
  ready: Promise<ServiceWorkerRegistration>;
}

declare interface Navigator {
  serviceWorker: ServiceWorkerInterface;
}

declare interface Window {
  navigator: Navigator;
}

declare var window: Window;
