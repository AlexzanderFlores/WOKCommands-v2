import { CommandInteraction } from "discord.js";

import WOK from "../../../../../typings";

export default async (interaction: CommandInteraction, instance: WOK) => {
  const { commandHandler } = instance;
  if (!commandHandler) {
    return;
  }

  const { commands, customCommands } = commandHandler;

  const args = interaction.options.data.map(({ value }) => {
    return String(value);
  });

  const command = commands.get(interaction.commandName);
  if (!command) {
    customCommands.run(interaction.commandName, null, interaction);
    return;
  }

  const { deferReply } = command.commandObject;

  if (deferReply) {
    await interaction.deferReply({
      ephemeral: deferReply === "ephemeral",
    });
  }

  const response = await commandHandler.runCommand(
    command,
    args,
    null,
    interaction
  );
  if (!response) {
    return;
  }

  if (deferReply) {
    interaction.editReply(response).catch(() => {});
  } else {
    interaction.reply(response).catch(() => {});
  }
};
