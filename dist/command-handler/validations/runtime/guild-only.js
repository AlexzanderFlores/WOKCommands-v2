"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (command, usage) => {
    const { guildOnly } = command.commandObject;
    const { guild, message, interaction } = usage;
    if (guildOnly === true && !guild) {
        const text = "This command can only be ran within a guild/server.";
        if (message)
            message.reply(text);
        else if (interaction)
            interaction.reply(text);
        return false;
    }
    return true;
};
