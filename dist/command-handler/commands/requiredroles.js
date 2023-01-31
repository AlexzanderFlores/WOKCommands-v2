"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandType_1 = __importDefault(require("../../util/CommandType"));
const required_roles_typeorm_1 = require("../../models/required-roles-typeorm");
const WOK_1 = require("../../WOK");
exports.default = {
    description: "Sets what commands require what roles",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    roles: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "command",
            description: "The command to set roles to",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "role",
            description: "The role to set for the command",
            type: discord_js_1.ApplicationCommandOptionType.Role,
            required: false,
        },
    ],
    autocomplete: (command) => {
        return [...command.instance.commandHandler.commands.keys()];
    },
    callback: async (commandUsage) => {
        const { instance, guild, args } = commandUsage;
        if (!instance.isConnectedToMariaDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        const [commandName, role] = args;
        const command = instance.commandHandler.commands.get(commandName);
        if (!command) {
            return {
                content: `The command \`${commandName}\` does not exist.`,
                ephemeral: true,
            };
        }
        // const _id = `${guild!.id}-${command.commandName}`;
        const repo = await WOK_1.ds.getRepository(required_roles_typeorm_1.RequiredRolesTypeorm);
        if (!role) {
            const document = await repo.find();
            let rolesOutput = "";
            if (document && document.length > 0) {
                for (const d of document) {
                    rolesOutput += `<@&${d.roleId}>`;
                }
            }
            else {
                rolesOutput = "None.";
            }
            return {
                content: `Here are the roles for \`${commandName}\`: ${rolesOutput}`,
                ephemeral: true,
                allowedMentions: {
                    roles: [],
                },
            };
        }
        const alreadyExistsRaw = await repo
            .createQueryBuilder("rrt")
            .where("guildId = :guildId", { guildId: guild.id })
            .andWhere("cmdId = :cmdId", { cmdId: commandName })
            .andWhere("roleId IN (:values)", { values: role })
            .getRawOne();
        if (alreadyExistsRaw) {
            await repo.delete({
                guildId: guild.id,
                cmdId: commandName,
                roleId: alreadyExistsRaw.rrt_roleId,
            });
            return {
                content: `The command \`${commandName}\` no longer requires the role <@&${role}>`,
                ephemeral: true,
                allowedMentions: {
                    roles: [],
                },
            };
        }
        await repo.insert({
            guildId: guild.id,
            cmdId: commandName,
            roleId: role,
        });
        return {
            content: `The command \`${commandName}\` now requires the role <@&${role}>`,
            ephemeral: true,
            allowedMentions: {
                roles: [],
            },
        };
    },
};
