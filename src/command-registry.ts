import { RunCommand } from "./interfaces/run-command";

let storedCommands: { [name: string]: CommandFunction } = {};
let listeners: { [name: string]: Set<CommandListener> } = {};

type CommandListener = (opts: any, event?: NotificationEvent) => void;

type CommandFunction = (opts: any, event?: NotificationEvent) => Promise<any>;

export function registerCommand(name: string, command: CommandFunction) {
  if (storedCommands[name]) {
    throw new Error(`Cannot add command '${name}', it already exists.`);
  }
  storedCommands[name] = command;
}

export function fireCommand({ command, options }: RunCommand, event?: NotificationEvent) {
  if (!storedCommands[command]) {
    throw new Error(`No such command '${command}'`);
  }

  if (listeners[command]) {
    listeners[command].forEach(l => l(options));
  }

  return storedCommands[command](options, event);
}

export function addListener(name: string, listener: CommandListener) {
  if (!listeners[name]) {
    listeners[name] = new Set();
  }

  listeners[name].add(listener);
}

export function removeListener(name: string, listener: CommandListener) {
  if (!listeners[name]) {
    return;
  }
  listeners[name].delete(listener);
}
