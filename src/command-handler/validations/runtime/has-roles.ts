import Command from "../../Command";
import { ds } from "../../../DCMD";
import { RequiredRolesTypeorm } from "../../../models/required-roles-typeorm";
import { CommandUsage } from "../../../../typings";

export default async (command: Command, usage: CommandUsage) => {
    const { instance, guild, member, message, interaction } = usage;

    if (!member || !instance.isConnectedToMariaDB) {
        return true;
    }

    const _id = `${guild!.id}-${command.commandName}`;
    const repo = await ds.getRepository(RequiredRolesTypeorm);
    const document = await repo.findBy({
        guildId: guild!.id,
        cmdId: command.commandName,
    });

    if (document.length > 0) {
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

        let rpl = "You need one of these roles: ";
        for (const role of document) {
            rpl += `<@&${role.roleId}>`;
        }

        const reply = {
            content: rpl,
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
