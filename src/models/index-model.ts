import {ChannelCommandsTypeorm} from "./channel-commands-typeorm";
import {CooldownTypeorm} from "./cooldown-typeorm";
import {CustomCommandTypeorm} from "./custom-command-typeorm";
import {DisabledCommandsTypeorm} from "./disabled-commands-typeorm";
import {GuildPrefixTypeorm} from "./guild-prefix-typeorm";
import {RequiredPermissionsTypeorm} from "./required-permissions-typeorm";
import {RequiredRolesTypeorm} from "./required-roles-typeorm";
import {ConfigTypeorm} from "./config-typeorm";

export const DbModels = [
    RequiredPermissionsTypeorm,
    DisabledCommandsTypeorm,
    ChannelCommandsTypeorm,
    CustomCommandTypeorm,
    RequiredRolesTypeorm,
    GuildPrefixTypeorm,
    CooldownTypeorm,
    ConfigTypeorm,
]

export default DbModels;