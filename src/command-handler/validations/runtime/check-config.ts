import Command from "../../Command";
import { ConfigTypeorm } from "../../../models/config-typeorm";
import { CommandUsage } from "../../../../typings";
import { ds } from "../../../WOK";

export default async (command: Command, usage: CommandUsage) => {
    const { configs } = command.commandObject;
    const { commandName, instance } = command;
    const { guild, channel, message, interaction } = usage;

    if (!guild || !instance.isConnectedToMariaDB) {
        return true;
    }

    const results = await ds
        .getRepository(ConfigTypeorm)
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

    let unsetConfigs: Map<string, string | null> = new Map<
        string,
        string | null
    >();
    results.forEach((x) =>
        unsetConfigs.set(x.c_key, !x.c_description ? null : x.c_description)
    );

    let text = `This command require these configs to be set:\n`;
    unsetConfigs.forEach(
        (value, key) =>
            (text += `\`${key}\`:\n> ${!value ? "Nemá popisek" : value}\n`)
    );

    if (message) message.reply(text);
    else if (interaction) interaction.reply(text);

    return false;
};
