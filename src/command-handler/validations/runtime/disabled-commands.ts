import Command from "../../Command";
import { CommandUsage } from "../../../../typings";

export default async (command: Command, usage: CommandUsage) => {
    const { commandName, instance } = command;
    const { guild, message, interaction } = usage;

    if (!guild || !instance.isConnectedToMariaDB) {
        return true;
    }

    if (
        instance.commandHandler.disabledCommands.isDisabled(
            guild.id,
            commandName
        )
    ) {
        const text = "This command is disabled";

        if (message) message.channel.send(text);
        else if (interaction) interaction.reply(text);

        return false;
    }

    return true;
};
