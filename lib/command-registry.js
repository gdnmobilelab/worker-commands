var storedCommands = {};
export function registerCommand(name, command) {
    if (storedCommands[name]) {
        throw new Error("Cannot add command '" + name + "', it already exists.");
    }
    storedCommands[name] = command;
}
export function fireCommand(_a, event) {
    var command = _a.command, options = _a.options;
    if (!storedCommands[command]) {
        throw new Error("No such command '" + command + "'");
    }
    return storedCommands[command](options, event);
}
