import { AutocompleteInteraction } from "discord.js";

import WOK from "../../../../../typings";

export default async (interaction: AutocompleteInteraction, instance: WOK) => {
  const { commandHandler } = instance;
  if (!commandHandler) {
    return;
  }

  const { commands } = commandHandler;
  const command = commands.get(interaction.commandName);
  if (!command) {
    return;
  }

  const { autocomplete } = command.commandObject;
  if (!autocomplete) {
    return;
  }

  const focusedOption = interaction.options.getFocused(true);
  const choices = await autocomplete(command, focusedOption.name, interaction);

  const filtered = choices
    .filter((choice: string) =>
      choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
    )
    .slice(0, 25);

  await interaction.respond(
    filtered.map((choice: string) => ({
      name: choice,
      value: choice,
    }))
  );
};
