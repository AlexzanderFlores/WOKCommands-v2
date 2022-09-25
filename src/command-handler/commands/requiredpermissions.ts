import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";

import requiredPermissions from "../../models/required-permissions-schema";
import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";
import Command from "../Command";

const clearAllPermissions = "Clear All Permissions";

export default {
  description: "Sets what commands require what permissions",

  type: CommandType.SLASH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  options: [
    {
      name: "command",
      description: "The command to set permissions to",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "permission",
      description: "The permission to set for the command",
      type: ApplicationCommandOptionType.String,
      required: false,
      autocomplete: true,
    },
  ],

  autocomplete: (command: Command, arg: string) => {
    if (arg === "command") {
      return [...command.instance.commandHandler.commands.keys()];
    } else if (arg === "permission") {
      return [clearAllPermissions, ...Object.keys(PermissionFlagsBits)];
    }
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

    const [commandName, permission] = args;

    const command = instance.commandHandler.commands.get(commandName);
    if (!command) {
      return {
        content: `The command "${commandName}" does not exist.`,
        ephemeral: true,
      };
    }

    const _id = `${guild!.id}-${command.commandName}`;

    if (!permission) {
      const document = await requiredPermissions.findById(_id);

      const permissions =
        document && document.permissions?.length
          ? document.permissions.join(", ")
          : "None.";

      return {
        content: `Here are the permissions for "${commandName}": ${permissions}`,
        ephemeral: true,
      };
    }

    if (permission === clearAllPermissions) {
      await requiredPermissions.deleteOne({ _id });

      return {
        content: `The command "${commandName}" no longer requires any permissions.`,
        ephemeral: true,
      };
    }

    const alreadyExists = await requiredPermissions.findOne({
      _id,
      permissions: {
        $in: [permission],
      },
    });

    if (alreadyExists) {
      await requiredPermissions.findOneAndUpdate(
        {
          _id,
        },
        {
          _id,
          $pull: {
            permissions: permission,
          },
        }
      );

      return {
        content: `The command "${commandName}" no longer requires the permission "${permission}"`,
        ephemeral: true,
      };
    }

    await requiredPermissions.findOneAndUpdate(
      {
        _id,
      },
      {
        _id,
        $addToSet: {
          permissions: permission,
        },
      },
      {
        upsert: true,
      }
    );

    return {
      content: `The command "${commandName}" now requires the permission "${permission}"`,
      ephemeral: true,
    };
  },
} as CommandObject;
