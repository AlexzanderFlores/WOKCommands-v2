"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command) => {
    const { instance, commandName, commandObject } = command;
    if (commandObject.testOnly !== true || instance.testServers.length) {
        return;
    }
    throw new Error(`Command "${commandName}" is a test only command, but no test servers were specified.`);
};
