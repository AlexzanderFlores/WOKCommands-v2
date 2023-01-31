"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
exports.default = {
    description: "Sets the prefix for this server",
    minArgs: 1,
    syntaxError: "Correct syntax: {PREFIX}prefix {ARGS}",
    expectedArgs: "<prefix>",
    type: CommandType_1.default.BOTH,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    callback: (commandUsage) => {
        const { instance, guild, text: prefix } = commandUsage;
        if (!instance.isConnectedToMariaDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        instance.commandHandler.prefixHandler.set(guild.id, prefix);
        return {
            content: `Set "${prefix}" as the command prefix for this server.`,
            ephemeral: true,
        };
    },
};
