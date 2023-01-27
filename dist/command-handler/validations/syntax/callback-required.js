"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command) => {
    const { commandObject, commandName } = command;
    if (!commandObject.callback) {
        throw new Error(`Command "${commandName}" does not have a callback function.`);
    }
};
