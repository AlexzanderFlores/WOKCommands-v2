"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
const event_list_1 = require("../../util/event-list");
exports.default = {
    description: "Simulate selected event",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    // testOnly: true,
    ownerOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "event",
            description: "Event name",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],
    autocomplete: (command) => {
        // return [...command.instance.commandHandler.configs];
        return event_list_1.discord_events;
    },
    callback: async (commandUsage) => {
        const { instance, guild, channel, member, message, text: commandName, interaction, client, } = commandUsage;
        if (!instance.isConnectedToMariaDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        if (!interaction.isChatInputCommand()) {
            return;
        }
        const event = interaction.options.getString("event");
        switch (event) {
            case "guildCreate":
                client.emit(event, guild);
                break;
            case "messageCreate":
                client.emit(event, message);
                break;
            case "channelCreate":
                client.emit(event, channel);
                break;
            case "guildMemberAdd":
                client.emit(event, member);
                break;
            case "guildMemberRemove":
                client.emit(event, member);
                break;
        }
        return {
            content: `Event \`${event}\` was emitted!`,
            ephemeral: true,
        };
    },
};
