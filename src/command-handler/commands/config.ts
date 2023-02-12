import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

import Command from "../Command";
import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";
import { ds } from "../../DCMD";
import { ConfigTypeorm } from "../../models/config-typeorm";

export default {
    description: "Toggles a command on or off for your guild",

    type: CommandType.SLASH,
    guildOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: "key",
            description: "Configuration key",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "value",
            description: "Configuration value",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: false,
        },
    ],

    autocomplete: (command: Command) => {
        return [...command.instance.commandHandler.configs];
    },

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

        const key = interaction.options.getString("command") as string;
        const value = interaction.options.getString("command") as string;

        await ds.getRepository(ConfigTypeorm).save({
            key,
            value,
        });

        return {
            content: `Konfigurace \`${key}\` byla nastavena na \`${value}\``,
            ephemeral: true,
        };
    },
} as CommandObject;
