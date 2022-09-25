import { PermissionFlagsBits } from "discord.js";

import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";

export default {
  description: "Sets the prefix for this server",

  minArgs: 1,
  syntaxError: "Correct syntax: {PREFIX}prefix {ARGS}",
  expectedArgs: "<prefix>",

  type: CommandType.BOTH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  callback: (commandUsage: CommandUsage) => {
    const { instance, guild, text: prefix } = commandUsage;

    if (!instance.isConnectedToDB) {
      return {
        content:
          "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
        ephemeral: true,
      };
    }

    instance.commandHandler.prefixHandler.set(guild!.id, prefix);

    return {
      content: `Set "${prefix}" as the command prefix for this server.`,
      ephemeral: true,
    };
  },
} as CommandObject;
