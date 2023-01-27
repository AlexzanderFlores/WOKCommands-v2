import requiredRoles from "../../../models/required-roles-schema";
import Command from "../../Command";
import { CommandUsage } from "../../../../typings";
import {RequiredPermissionsTypeorm} from "../../../models/required-permissions-typeorm";

export default async (command: Command, usage: CommandUsage) => {
  const { instance, guild, member, message, interaction } = usage;

  if (!member || !instance.isConnectedToMariaDB) {
    return true;
  }

  const _id = `${guild!.id}-${command.commandName}`;
  // const document = await requiredRoles.findById(_id);
  const ds = instance.dataSource;
  const repo = await ds.getRepository(requiredRoles);
  const document = await repo.findBy({
    guildId: guild!.id,
    cmdId: command.commandName
  })

  if (document) {
    let hasRole = false;

    for (const doc of document) {
      if (member.roles.cache.has(doc.roleId)) {
        hasRole = true;
        break;
      }
    }

    if (hasRole) {
      return true;
    }

    const reply = {
      content: `You need one of these roles: ${document.map(
        (roleId: string) => `<@&${roleId}>` // Todo: ??
      )}`,
      allowedMentions: {
        roles: [],
      },
    };

    if (message) message.reply(reply);
    else if (interaction) interaction.reply(reply);

    return false;
  }

  return true;
};
