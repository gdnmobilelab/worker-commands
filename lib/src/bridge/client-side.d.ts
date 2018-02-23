import { RunCommand } from "../interfaces/run-command";
export declare const PAYLOAD_KEY = "__workerCommandPayload";
export declare function sendClient(cmd: RunCommand<any> | RunCommand<any>[]): Promise<any>;
