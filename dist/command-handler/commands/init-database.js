"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
const config_migration_1 = require("../../models/migrations/config-migration");
const configs = ["configs", "users"];
exports.default = {
    description: "Import important database data",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    ownerOnly: true,
    excludeLog: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "type",
            description: "Type of data",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: false,
            autocomplete: false,
            choices: configs.map((config) => ({
                name: config,
                value: config,
            })),
        },
    ],
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
        const type = interaction.options.getString("type");
        if (!type) {
            await (0, config_migration_1.migrateConfig)();
        }
        else {
            if (type == "config") {
                await (0, config_migration_1.migrateConfig)();
            }
        }
        return {
            content: `Migration of \`${!type ? "all" : type}\` was completed.`,
            ephemeral: true,
        };
    },
};
