"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
exports.default = {
    description: "Specifies what commands can be ran inside of what channels",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    options: [
        {
            name: "command",
            description: "The command to restrict to specific channels",
            required: true,
            type: discord_js_1.ApplicationCommandOptionType.String,
            autocomplete: true,
        },
        {
            name: "channel",
            description: "The channel to use for this command",
            required: true,
            type: discord_js_1.ApplicationCommandOptionType.Channel,
        },
    ],
    autocomplete: (command) => {
        return [...command.instance.commandHandler.commands.keys()];
    },
    callback: async (commandUsage) => {
        const { instance, guild } = commandUsage;
        if (!instance.isConnectedToMariaDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        const interaction = commandUsage.interaction;
        // @ts-ignore
        const commandName = interaction.options.getString("command");
        // @ts-ignore
        const channel = interaction.options.getChannel("channel");
        const command = instance.commandHandler.commands.get(commandName.toLowerCase());
        if (!command) {
            return {
                content: `The command "${commandName}" does not exist.`,
                ephemeral: true,
            };
        }
        const { channelCommands } = instance.commandHandler;
        let availableChannels = [];
        // @ts-ignore
        const canRun = (await channelCommands.getAvailableChannels(guild.id, commandName)).includes(channel.id);
        if (canRun) {
            availableChannels = await channelCommands.remove(guild.id, commandName, channel.id);
        }
        else {
            availableChannels = await channelCommands.add(guild.id, commandName, channel.id);
        }
        if (availableChannels.length) {
            const channelNames = availableChannels.map((c) => `<#${c}> `);
            return {
                content: `The command "${commandName}" can now only be ran inside of the following channels: ${channelNames}`,
                ephemeral: true,
            };
        }
        return {
            content: `The command "${commandName}" can now be ran inside of any text channel.`,
            ephemeral: true,
        };
    },
};
