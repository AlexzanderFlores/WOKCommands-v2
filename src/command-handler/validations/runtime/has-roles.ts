import requiredRoles from "../../../models/required-roles-schema";
import Command from "../../Command";
import { CommandUsage } from "../../../../typings";

export default async (command: Command, usage: CommandUsage) => {
  const { instance, guild, member, message, interaction } = usage;

  if (!member || !instance.isConnectedToDB) {
    return true;
  }

  const _id = `${guild!.id}-${command.commandName}`;
  const document = await requiredRoles.findById(_id);

  if (document) {
    let hasRole = false;

    for (const roleId of document.roles) {
      if (member.roles.cache.has(roleId)) {
        hasRole = true;
        break;
      }
    }

    if (hasRole) {
      return true;
    }

    const reply = {
      content: `You need one of these roles: ${document.roles.map(
        (roleId: string) => `<@&${roleId}>`
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
