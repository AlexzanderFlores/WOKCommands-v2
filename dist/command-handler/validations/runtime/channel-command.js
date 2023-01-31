"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (command, usage) => {
    const { commandName, instance } = command;
    const { guild, channel, message, interaction } = usage;
    if (!guild || !instance.isConnectedToMariaDB) {
        return true;
    }
    const availableChannels = await instance.commandHandler.channelCommands.getAvailableChannels(guild.id, commandName);
    if (availableChannels.length && !availableChannels.includes(channel.id)) {
        const channelNames = availableChannels.map((c) => `<#${c}> `);
        const reply = `You can only run this command inside of the following channels: ${channelNames}.`;
        if (message)
            message.reply(reply);
        else if (interaction)
            interaction.reply(reply);
        return false;
    }
    return true;
};
