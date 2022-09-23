import { PermissionFlagsBits } from "discord.js";

import { CommandType } from "../..";
import { CommandObject, CommandUsage } from "../../../typings";

export default {
  description: "Creates a custom command",

  minArgs: 3,
  syntaxError: "Correct syntax: {PREFIX}customCommand {ARGS}",
  expectedArgs: "<command name> <description> <response>",

  type: CommandType.BOTH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  callback: async (commandUsage: CommandUsage) => {
    const { instance, args, guild } = commandUsage;

    if (!instance.isConnectedToDB) {
      return {
        content:
          "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
        ephemeral: true,
      };
    }

    const [commandName, description, response] = args;

    await instance.commandHandler.customCommands.create(
      guild!.id,
      commandName,
      description,
      response
    );

    return `Custom command "${commandName}" has been created!`;
  },
} as CommandObject;
