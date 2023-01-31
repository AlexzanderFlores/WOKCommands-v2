"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command) => {
    const { commandObject, commandName } = command;
    const { cooldowns } = commandObject;
    if (!cooldowns) {
        return;
    }
    if (!cooldowns.type || !cooldowns.duration) {
        throw new Error(`Invalid cooldown for command "${commandName}". It must have a "type" and "duration" property.`);
    }
};
