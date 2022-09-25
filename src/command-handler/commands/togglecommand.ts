import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";

import Command from "../Command";
import CommandType from "../../util/CommandType";
import { CommandUsage } from "../../../typings";

export default {
  description: "Toggles a command on or off for your guild",

  type: CommandType.SLASH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  options: [
    {
      name: "command",
      description: "The command to toggle on or off",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  autocomplete: (command: Command) => {
    return [...command.instance.commandHandler.commands.keys()];
  },

  callback: async (commandUsage: CommandUsage) => {
    const { instance, guild, text: commandName, interaction } = commandUsage;

    if (!instance.isConnectedToDB) {
      return {
        content:
          "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
        ephemeral: true,
      };
    }

    const { disabledCommands } = instance.commandHandler;

    if (disabledCommands.isDisabled(guild!.id, commandName)) {
      await disabledCommands.enable(guild!.id, commandName);

      return {
        content: `Command "${commandName}" has been enabled`,
        ephemeral: true,
      };
    } else {
      await disabledCommands.disable(guild!.id, commandName);

      return {
        content: `Command "${commandName}" has been disabled`,
        ephemeral: true,
      };
    }
  },
};
