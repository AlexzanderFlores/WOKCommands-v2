import { AutocompleteInteraction } from 'discord.js';
import WOK from '../../../../WOK';
import { AutocompleteChoice } from '../../../../types';

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
    .filter((choice) => {
      const choiceName = typeof choice === 'string' ? choice : choice.name;
      return choiceName
        .toLowerCase()
        .includes(focusedOption.value.toLowerCase());
    })
    .slice(0, 25);

  await interaction.respond(
    filtered.map((choice) => ({
      name: typeof choice === 'string' ? choice : choice.name,
      value: typeof choice === 'string' ? choice : choice.value,
    }))
  );
};
