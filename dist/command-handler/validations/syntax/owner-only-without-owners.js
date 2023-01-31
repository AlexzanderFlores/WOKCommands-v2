"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command) => {
    const { instance, commandName, commandObject } = command;
    if (commandObject.ownerOnly !== true || instance.botOwners.length) {
        return;
    }
    throw new Error(`Command "${commandName}" is a owner only command, but no owners were specified.`);
};
