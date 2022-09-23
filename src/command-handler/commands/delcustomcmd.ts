import { PermissionFlagsBits } from "discord.js";

import { CommandType } from "../..";
import { CommandObject, CommandUsage } from "../../../typings";

export default {
  description: "Deletes a custom command",

  minArgs: 1,
  syntaxError: "Correct syntax: {PREFIX}delCustomCmd {ARGS}",
  expectedArgs: "<command name>",

  type: CommandType.SLASH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  callback: async (commandUsage: CommandUsage) => {
    const { instance, text: commandName, guild } = commandUsage;

    if (!instance.isConnectedToDB) {
      return {
        content:
          "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
        ephemeral: true,
      };
    }

    await instance.commandHandler.customCommands.delete(guild!.id, commandName);

    return `Custom command "${commandName}" has been deleted!`;
  },
} as CommandObject;
