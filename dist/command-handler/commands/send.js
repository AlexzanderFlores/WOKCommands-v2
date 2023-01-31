"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
exports.default = {
    description: "Send message to channel",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    // permissions: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: "message",
            description: "Message content",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            descriptionLocalizations: {
                cs: "Obsah zprávy",
            },
        },
        {
            name: "channel",
            description: "Text channel",
            type: discord_js_1.ApplicationCommandOptionType.Channel,
            required: false,
            descriptionLocalizations: {
                cs: "Textový kanál",
            },
            channelTypes: [discord_js_1.ChannelType.GuildText],
        },
    ],
    callback: (commandUsage) => {
        const { instance, guild, channel, text: prefix } = commandUsage;
        const interaction = commandUsage.interaction;
        let sendChannel = undefined;
        // @ts-ignore
        const intChannel = interaction.options.getChannel("channel");
        // @ts-ignore
        const intMessage = interaction.options.getString("message");
        sendChannel = intChannel
            ? intChannel
            : channel;
        sendChannel.send({
            content: intMessage,
        });
        return {
            content: `Zpráva byla úspěšně odeslána.`,
            ephemeral: true,
        };
    },
};
