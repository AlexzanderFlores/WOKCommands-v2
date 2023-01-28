import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

import Command from "../Command";
import CommandType from "../../util/CommandType";
import { CommandUsage } from "../../../typings";
import { discord_events } from "../../util/event-list";

export default {
    description: "Simulate selected event",

    type: CommandType.SLASH,
    guildOnly: true,
    // testOnly: true,
    ownerOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: "event",
            description: "Event name",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],

    autocomplete: (command: Command) => {
        // return [...command.instance.commandHandler.configs];
        return discord_events;
    },

    callback: async (commandUsage: CommandUsage) => {
        const {
            instance,
            guild,
            channel,
            member,
            message,
            text: commandName,
            interaction,
            client,
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

        const event = interaction.options.getString("event") as string;

        switch (event) {
            case "guildCreate":
                client.emit(event, guild!);
                break;
            case "messageCreate":
                client.emit(event, message!);
                break;
            case "channelCreate":
                client.emit(event, channel!);
                break;
            case "guildMemberAdd":
                client.emit(event, member!);
                break;
            case "guildMemberRemove":
                client.emit(event, member!);
                break;
        }

        return {
            content: `Event \`${event}\` was emitted!`,
            ephemeral: true,
        };
    },
};
