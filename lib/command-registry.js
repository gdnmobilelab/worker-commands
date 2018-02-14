var storedCommands = {};
var listeners = {};
export function registerCommand(name, command) {
    if (storedCommands[name]) {
        throw new Error("Cannot add command '" + name + "', it already exists.");
    }
    storedCommands[name] = command;
}
function fireIndividualCommand(_a, event) {
    var command = _a.command, options = _a.options;
    if (!storedCommands[command]) {
        throw new Error("No such command '" + command + "'");
    }
    if (listeners[command]) {
        listeners[command].forEach(function (l) { return l(options, event); });
    }
    return storedCommands[command](options, event);
}
export function fireCommand(command, event) {
    if (command instanceof Array) {
        return Promise.all(command.map(function (c) { return fireIndividualCommand(c, event); }));
    }
    return fireIndividualCommand(command, event);
}
export function addListener(name, listener) {
    if (!listeners[name]) {
        listeners[name] = new Set();
    }
    listeners[name].add(listener);
}
export function removeListener(name, listener) {
    if (!listeners[name]) {
        return;
    }
    listeners[name].delete(listener);
}
