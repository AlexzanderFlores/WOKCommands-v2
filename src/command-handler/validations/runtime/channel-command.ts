import Command from "../../Command";
import { CommandUsage } from "../../../../typings";

export default async (command: Command, usage: CommandUsage) => {
  const { commandName, instance } = command;
  const { guild, channel, message, interaction } = usage;

  if (!guild || !instance.isConnectedToDB) {
    return true;
  }

  const availableChannels =
    await instance.commandHandler.channelCommands.getAvailableChannels(
      guild.id,
      commandName
    );

  if (availableChannels.length && !availableChannels.includes(channel!.id)) {
    const channelNames = availableChannels.map((c: string) => `<#${c}> `);
    const reply = `You can only run this command inside of the following channels: ${channelNames}.`;

    if (message) message.reply(reply);
    else if (interaction) interaction.reply(reply);

    return false;
  }

  return true;
};
