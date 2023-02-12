"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DCMD_1 = require("../../../DCMD");
const required_roles_typeorm_1 = require("../../../models/required-roles-typeorm");
exports.default = async (command, usage) => {
    const { instance, guild, member, message, interaction } = usage;
    if (!member || !instance.isConnectedToMariaDB) {
        return true;
    }
    const _id = `${guild.id}-${command.commandName}`;
    const repo = await DCMD_1.ds.getRepository(required_roles_typeorm_1.RequiredRolesTypeorm);
    const document = await repo.findBy({
        guildId: guild.id,
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
        if (message)
            message.reply(reply);
        else if (interaction)
            interaction.reply(reply);
        return false;
    }
    return true;
};
