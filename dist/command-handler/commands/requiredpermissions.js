"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
const required_permissions_typeorm_1 = require("../../models/required-permissions-typeorm");
const WOK_1 = require("../../WOK");
const clearAllPermissions = "Clear All Permissions";
exports.default = {
    description: "Sets what commands require what permissions",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "command",
            description: "The command to set permissions to",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "permission",
            description: "The permission to set for the command",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true,
        },
    ],
    autocomplete: (command, arg) => {
        if (arg === "command") {
            return [...command.instance.commandHandler.commands.keys()];
        }
        else if (arg === "permission") {
            return [clearAllPermissions, ...Object.keys(discord_js_1.PermissionFlagsBits)];
        }
    },
    callback: async (commandUsage) => {
        const { instance, guild, args } = commandUsage;
        if (!instance.isConnectedToMariaDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        const [commandName, permission] = args;
        const command = instance.commandHandler.commands.get(commandName);
        if (!command) {
            return {
                content: `The command \`${commandName}\` does not exist.`,
                ephemeral: true,
            };
        }
        // const _id = `${guild!.id}-${command.commandName}`;
        const repo = await WOK_1.ds.getRepository(required_permissions_typeorm_1.RequiredPermissionsTypeorm);
        if (!permission) {
            const document = await repo.find();
            let permissions = "";
            if (document && document.length > 0) {
                for (const d of document) {
                    permissions += `\`${d.permission}\`, `;
                }
                permissions = permissions.slice(0, -2);
            }
            else {
                permissions = "None.";
            }
            return {
                content: `Here are the permissions for \`${commandName}\`: ${permissions}`,
                ephemeral: true,
            };
        }
        if (permission === clearAllPermissions) {
            await repo.delete({
                guildId: guild.id,
            });
            return {
                content: `The command \`${commandName}\` no longer requires any permissions.`,
                ephemeral: true,
            };
        }
        const alreadyExistsRaw = await repo
            .createQueryBuilder("rpt")
            .where("guildId = :guildId", { guildId: guild.id })
            .andWhere("cmdId = :cmdId", { cmdId: commandName })
            .andWhere("permission IN (:values)", { values: permission })
            .getRawOne();
        if (alreadyExistsRaw) {
            await repo.delete({
                guildId: guild.id,
                cmdId: commandName,
                permission: alreadyExistsRaw.rpt_permission,
            });
            return {
                content: `The command \`${commandName}\` no longer requires the permission \`${permission}\``,
                ephemeral: true,
            };
        }
        await repo.insert({
            guildId: guild.id,
            cmdId: commandName,
            permission: permission,
        });
        return {
            content: `The command \`${commandName}\` now requires the permission \`${permission}\``,
            ephemeral: true,
        };
    },
};
