import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";

import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";
import Command from "../Command";

const noCommands = "No custom commands configured.";

export default {
  description: "Creates a custom command",
  type: CommandType.SLASH,
  guildOnly: true,
  permissions: [PermissionFlagsBits.Administrator],

  options: [
    {
      name: "create",
      description: "Creates a custom command",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "command",
          description: "The name of the command",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "description",
          description: "The description of the command",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "response",
          description: "The response of the command",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "delete",
      description: "Deletes a custom command",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "command",
          description: "The name of the command",
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    },
  ],

  autocomplete: (
    command: Command,
    _: string,
    interaction: AutocompleteInteraction
  ) => {
    const results = [
      ...command.instance.commandHandler.customCommands.getCommands(
        interaction.guild?.id
      ),
    ];

    if (results.length === 0) {
      results.push(noCommands);
    }

    return results;
  },

  callback: async (commandUsage: CommandUsage) => {
    const { instance, guild } = commandUsage;
    const interaction = commandUsage.interaction as ChatInputCommandInteraction;

    if (!instance.isConnectedToDB) {
      return {
        content:
          "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
        ephemeral: true,
      };
    }

    const sub = interaction.options.getSubcommand();

    if (sub === "create") {
      const commandName = interaction.options.getString("command");
      const description = interaction.options.getString("description");
      const response = interaction.options.getString("response");

      await instance.commandHandler.customCommands.create(
        guild!.id,
        commandName,
        description,
        response
      );

      return {
        content: `Custom command "${commandName}" has been created!`,
        ephemeral: true,
      };
    } else if (sub === "delete") {
      const commandName = interaction.options.getString("command");

      if (commandName === noCommands) {
        return {
          content: "There are no custom commands to delete.",
          ephemeral: true,
        };
      }

      await instance.commandHandler.customCommands.delete(
        guild!.id,
        commandName
      );

      return {
        content: `Custom command "${commandName}" has been deleted!`,
        ephemeral: true,
      };
    }
  },
} as CommandObject;
