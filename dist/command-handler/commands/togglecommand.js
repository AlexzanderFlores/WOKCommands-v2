"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
exports.default = {
    description: "Toggles a command on or off for your guild",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "command",
            description: "The command to toggle on or off",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],
    autocomplete: (command) => {
        return [...command.instance.commandHandler.commands.keys()];
    },
    callback: async (commandUsage) => {
        const { instance, guild, text: commandName, interaction } = commandUsage;
        if (!instance.isConnectedToMariaDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        const { disabledCommands } = instance.commandHandler;
        if (disabledCommands.isDisabled(guild.id, commandName)) {
            await disabledCommands.enable(guild.id, commandName);
            return {
                content: `Command "${commandName}" has been enabled`,
                ephemeral: true,
            };
        }
        else {
            await disabledCommands.disable(guild.id, commandName);
            return {
                content: `Command "${commandName}" has been disabled`,
                ephemeral: true,
            };
        }
    },
};
