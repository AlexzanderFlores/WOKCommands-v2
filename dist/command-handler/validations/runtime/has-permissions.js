"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const required_permissions_typeorm_1 = require("../../../models/required-permissions-typeorm");
const DCMD_1 = require("../../../DCMD");
const keys = Object.keys(discord_js_1.PermissionFlagsBits);
exports.default = async (command, usage) => {
    const { permissions = [] } = command.commandObject;
    const { instance, guild, member, message, interaction } = usage;
    if (!member || !instance.isConnectedToMariaDB) {
        return true;
    }
    const repo = await DCMD_1.ds.getRepository(required_permissions_typeorm_1.RequiredPermissionsTypeorm);
    const document = await repo.findBy({
        guildId: guild.id,
        cmdId: command.commandName,
    });
    if (document.length > 0) {
        for (const permission of document) {
            if (!permissions.includes(permission.permission)) {
                permissions.push(permission.permission);
            }
        }
    }
    if (permissions.length) {
        const missingPermissions = [];
        for (const permission of permissions) {
            // @ts-ignore
            if (!member.permissions.has(permission)) {
                const permissionName = keys.find(
                // @ts-ignore
                // prettier-ignore
                (key) => key === permission || discord_js_1.PermissionFlagsBits[key] === permission);
                missingPermissions.push(permissionName);
            }
        }
        if (missingPermissions.length) {
            const text = `You are missing the following permissions: "${missingPermissions.join('", "')}"`;
            if (message)
                message.reply(text);
            else if (interaction)
                interaction.reply(text);
            return false;
        }
    }
    return true;
};
