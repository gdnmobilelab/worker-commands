var storedCommands = {};
var listeners = {};
// Add a command to the internal registry. This is used by the library itself
// but also exposed so that you can register custom commands in an individual project.
export function registerCommand(name, command) {
    if (storedCommands[name]) {
        throw new Error("Cannot add command '" + name + "', it already exists.");
    }
    storedCommands[name] = command;
}
function fireIndividualCommand(runCmd, event) {
    var command = runCmd.command, options = runCmd.options;
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
