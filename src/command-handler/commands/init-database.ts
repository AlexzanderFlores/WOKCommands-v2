import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";
import { migrateConfig } from "../../models/migrations/config-migration";

const configs = ["configs", "users"];

export default {
    description: "Import important database data",

    type: CommandType.SLASH,
    guildOnly: true,
    ownerOnly: true,
    excludeLog: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: "type",
            description: "Type of data",
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: false,
            choices: configs.map((config) => ({
                name: config,
                value: config,
            })),
        },
    ],

    callback: async (commandUsage: CommandUsage) => {
        const {
            instance,
            guild,
            text: commandName,
            interaction,
        } = commandUsage;

        if (!instance.isConnectedToMariaDB) {
            return {
                content:
                    "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }

        if (!interaction!.isChatInputCommand()) {
            return;
        }

        const type = interaction.options.getString("type");

        if (!type) {
            await migrateConfig();
        } else {
            if (type == "config") {
                await migrateConfig();
            }
        }

        return {
            content: `Migration of \`${!type ? "all" : type}\` was completed.`,
            ephemeral: true,
        };
    },
} as CommandObject;
