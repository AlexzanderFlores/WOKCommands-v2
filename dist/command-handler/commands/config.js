"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
const WOK_1 = require("../../WOK");
const config_typeorm_1 = require("../../models/config-typeorm");
exports.default = {
    description: "Toggles a command on or off for your guild",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "key",
            description: "Configuration key",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "value",
            description: "Configuration value",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: false,
        },
    ],
    autocomplete: (command) => {
        return [...command.instance.commandHandler.configs];
    },
    callback: async (commandUsage) => {
        const { instance, guild, text: commandName, interaction, } = commandUsage;
        if (!instance.isConnectedToMariaDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        if (!interaction.isChatInputCommand()) {
            return;
        }
        const key = interaction.options.getString("command");
        const value = interaction.options.getString("command");
        await WOK_1.ds.getRepository(config_typeorm_1.ConfigTypeorm).save({
            key,
            value,
        });
        return {
            content: `Konfigurace \`${key}\` byla nastavena na \`${value}\``,
            ephemeral: true,
        };
    },
};
