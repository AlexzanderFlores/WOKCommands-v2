"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command, usage) => {
    const { instance, commandObject } = command;
    const { guild } = usage;
    if (commandObject.testOnly !== true) {
        return true;
    }
    return instance.testServers.includes(guild?.id || "");
};
