import {
    PermissionFlagsBits,
    ApplicationCommandOptionType,
    ChannelType,
    CommandInteraction,
    TextChannel
} from "discord.js";

import CommandType from "../../util/CommandType";
import {CommandObject, CommandUsage} from "../../../typings";

export default {
    description: "Send message to channel",

    type: CommandType.SLASH,
    guildOnly: true,

    // permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: 'message',
            description: 'Message content',
            type: ApplicationCommandOptionType.String,
            required: true,
            descriptionLocalizations: {
                cs: 'Obsah zprávy'
            }
        },
        {
            name: 'channel',
            description: 'Text channel',
            type: ApplicationCommandOptionType.Channel,
            required: false,
            descriptionLocalizations: {
                cs: 'Textový kanál'
            },
            channelTypes: [
                ChannelType.GuildText
            ]
        },
    ],

    callback: (commandUsage: CommandUsage) => {
        const {instance, guild, channel, text: prefix} = commandUsage;
        const interaction: CommandInteraction = commandUsage.interaction!;

        let sendChannel: TextChannel | undefined = undefined;
        // @ts-ignore
        const intChannel = interaction.options.getChannel("channel");
        // @ts-ignore
        const intMessage = interaction.options.getString("message") as string;

        sendChannel = intChannel ? intChannel as TextChannel : channel as TextChannel

        sendChannel.send({
            content: intMessage
        })

        return {
            content: `Set "${prefix}" as the command prefix for this server.`,
            ephemeral: true,
        };
    },
} as CommandObject;
