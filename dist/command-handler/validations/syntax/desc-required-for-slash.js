"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CommandType_1 = __importDefault(require("../../../util/CommandType"));
exports.default = (command) => {
    const { commandName, commandObject } = command;
    if (commandObject.type === CommandType_1.default.SLASH ||
        commandObject.type === CommandType_1.default.BOTH) {
        if (!commandObject.description) {
            throw new Error(`Command "${commandName}" is a slash command but does not have a description`);
        }
    }
};
