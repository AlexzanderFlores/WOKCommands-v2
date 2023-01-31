"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbModels = void 0;
const channel_commands_typeorm_1 = require("./channel-commands-typeorm");
const cooldown_typeorm_1 = require("./cooldown-typeorm");
const custom_command_typeorm_1 = require("./custom-command-typeorm");
const disabled_commands_typeorm_1 = require("./disabled-commands-typeorm");
const guild_prefix_typeorm_1 = require("./guild-prefix-typeorm");
const required_permissions_typeorm_1 = require("./required-permissions-typeorm");
const required_roles_typeorm_1 = require("./required-roles-typeorm");
const config_typeorm_1 = require("./config-typeorm");
const command_log_typeorm_1 = require("./command-log-typeorm");
exports.DbModels = [
    required_permissions_typeorm_1.RequiredPermissionsTypeorm,
    disabled_commands_typeorm_1.DisabledCommandsTypeorm,
    channel_commands_typeorm_1.ChannelCommandsTypeorm,
    custom_command_typeorm_1.CustomCommandTypeorm,
    required_roles_typeorm_1.RequiredRolesTypeorm,
    guild_prefix_typeorm_1.GuildPrefixTypeorm,
    command_log_typeorm_1.CommandLogTypeorm,
    cooldown_typeorm_1.CooldownTypeorm,
    config_typeorm_1.ConfigTypeorm,
];
exports.default = exports.DbModels;
