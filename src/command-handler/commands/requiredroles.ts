import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

import CommandType from "../../util/CommandType";
import { CommandObject, CommandUsage } from "../../../typings";
import Command from "../Command";
import { RequiredRolesTypeorm } from "../../models/required-roles-typeorm";
import { ds } from "../../DCMD";

export default {
    description: "Sets what commands require what roles",

    type: CommandType.SLASH,
    guildOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

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
                content: `The command \`${commandName}\` does not exist.`,
                ephemeral: true,
            };
        }

        // const _id = `${guild!.id}-${command.commandName}`;
        const repo = await ds.getRepository(RequiredRolesTypeorm);

        if (!role) {
            const document = await repo.find();

            let rolesOutput: string = "";
            if (document && document.length > 0) {
                for (const d of document) {
                    rolesOutput += `<@&${d.roleId}>`;
                }
            } else {
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
            .where("guildId = :guildId", { guildId: guild!.id })
            .andWhere("cmdId = :cmdId", { cmdId: commandName })
            .andWhere("roleId IN (:values)", { values: role })
            .getRawOne();

        if (alreadyExistsRaw) {
            await repo.delete({
                guildId: guild!.id,
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
            guildId: guild!.id,
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
} as CommandObject;
