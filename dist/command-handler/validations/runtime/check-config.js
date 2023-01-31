"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_typeorm_1 = require("../../../models/config-typeorm");
const WOK_1 = require("../../../WOK");
exports.default = async (command, usage) => {
    const { configs } = command.commandObject;
    const { commandName, instance } = command;
    const { guild, channel, message, interaction } = usage;
    if (!guild || !instance.isConnectedToMariaDB) {
        return true;
    }
    const results = await WOK_1.ds
        .getRepository(config_typeorm_1.ConfigTypeorm)
        .createQueryBuilder("c")
        .where("value is null")
        .andWhere("`key` IN (:keys)", { keys: configs })
        .getRawMany();
    if (!results) {
        return true;
    }
    if (results.length == 0) {
        return true;
    }
    let unsetConfigs = new Map();
    results.forEach((x) => unsetConfigs.set(x.c_key, !x.c_description ? null : x.c_description));
    let text = `This command require these configs to be set:\n`;
    unsetConfigs.forEach((value, key) => (text += `> _${key}_:\n\`\`\`\n${!value ? "Nemá popisek" : value}\`\`\`\n`));
    if (message)
        message.reply(text);
    else if (interaction)
        interaction.reply(text);
    return false;
};
