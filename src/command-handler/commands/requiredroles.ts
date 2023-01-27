import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";

import requiredroles from "../../models/required-roles-schema";
import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";
import Command from "../Command";
import {RequiredPermissionsTypeorm} from "../../models/required-permissions-typeorm";
import {RequiredRolesTypeorm} from "../../models/required-roles-typeorm";

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

    if (!instance.isConnectedToMariaDB) {
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
    const ds = instance.dataSource;
    const repo = await ds.getRepository(RequiredRolesTypeorm);

    if (!role) {
      // const document = await requiredroles.findById(_id);
      const document = await repo.find();

      // const roles =
      //   document && document.roles?.length
      //     ? document.roles.map((roleId: string) => `<@&${roleId}>`)
      //     : "None.";

      let roles: string = '';
      if (document && document.length) {
        for (const d of document) {
          roles += `<@&${d}>`;
        }
      } else {
        roles = "None."
      }

      return {
        content: `Here are the roles for "${commandName}": ${roles}`,
        ephemeral: true,
        allowedMentions: {
          roles: [],
        },
      };
    }

    // const alreadyExists = await requiredroles.findOne({
    //   _id,
    //   roles: {
    //     $in: [role],
    //   },
    // });
    const alreadyExistsRaw = await repo.createQueryBuilder()
    .where('guildId = :guildId', {guildId: guild!.id})
    .andWhere('cmdId = :cmdId', {cmdId: commandName})
    .andWhere('roleId IN (:..values)', {values: role})
    .getRawOne();

    if (alreadyExistsRaw) {
      // await requiredroles.findOneAndUpdate(
      //   {
      //     _id,
      //   },
      //   {
      //     _id,
      //     $pull: {
      //       roles: role,
      //     },
      //   }
      // );

      await repo.delete({
        guildId: guild!.id,
        cmdId: commandName,
        roleId: alreadyExistsRaw.permission
      });

      return {
        content: `The command "${commandName}" no longer requires the role <@&${role}>`,
        ephemeral: true,
        allowedMentions: {
          roles: [],
        },
      };
    }

    // await requiredroles.findOneAndUpdate(
    //   {
    //     _id,
    //   },
    //   {
    //     _id,
    //     $addToSet: {
    //       roles: role,
    //     },
    //   },
    //   {
    //     upsert: true,
    //   }
    // );
    await repo.insert({
      guildId: guild!.id,
      cmdId: commandName,
      roleId: role
    })

    return {
      content: `The command "${commandName}" now requires the role <@&${role}>`,
      ephemeral: true,
      allowedMentions: {
        roles: [],
      },
    };
  },
} as CommandObject;
