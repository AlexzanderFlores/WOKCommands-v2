import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";

import requiredroles from "../../models/required-roles-schema";
import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";
import Command from "../Command";

export default {
  description: "Sets what commands require what roles",

  type: CommandType.SLASH,
  guildOnly: true,

  roles: [PermissionFlagsBits.Administrator],

  options: [
    {
      name: "command",
      description: "The command to set roles to",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "role",
      description: "The role to set for the command",
      type: ApplicationCommandOptionType.Role,
      required: false,
    },
  ],

  autocomplete: (command: Command) => {
    return [...command.instance.commandHandler.commands.keys()];
  },

  callback: async (commandUsage: CommandUsage) => {
    const { instance, guild, args } = commandUsage;

    if (!instance.isConnectedToDB) {
      return {
        content:
          "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
        ephemeral: true,
      };
    }

    const [commandName, role] = args;

    const command = instance.commandHandler.commands.get(commandName);
    if (!command) {
      return {
        content: `The command "${commandName}" does not exist.`,
        ephemeral: true,
      };
    }

    const _id = `${guild!.id}-${command.commandName}`;

    if (!role) {
      const document = await requiredroles.findById(_id);

      const roles =
        document && document.roles?.length
          ? document.roles.map((roleId: string) => `<@&${roleId}>`)
          : "None.";

      return {
        content: `Here are the roles for "${commandName}": ${roles}`,
        ephemeral: true,
        allowedMentions: {
          roles: [],
        },
      };
    }

    const alreadyExists = await requiredroles.findOne({
      _id,
      roles: {
        $in: [role],
      },
    });

    if (alreadyExists) {
      await requiredroles.findOneAndUpdate(
        {
          _id,
        },
        {
          _id,
          $pull: {
            roles: role,
          },
        }
      );

      return {
        content: `The command "${commandName}" no longer requires the role <@&${role}>`,
        ephemeral: true,
        allowedMentions: {
          roles: [],
        },
      };
    }

    await requiredroles.findOneAndUpdate(
      {
        _id,
      },
      {
        _id,
        $addToSet: {
          roles: role,
        },
      },
      {
        upsert: true,
      }
    );

    return {
      content: `The command "${commandName}" now requires the role <@&${role}>`,
      ephemeral: true,
      allowedMentions: {
        roles: [],
      },
    };
  },
} as CommandObject;
