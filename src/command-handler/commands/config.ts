import {ApplicationCommandOptionType, PermissionFlagsBits} from "discord.js";

import Command from "../Command";
import CommandType from "../../util/CommandType";
import {CommandUsage} from "../../../typings";

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
        const {instance, guild, text: commandName, interaction} = commandUsage;

        if (!instance.isConnectedToMariaDB) {
            return {
                content:
                    "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }


        return {
            content: `Test`,
            ephemeral: true,
        };

    },
};
