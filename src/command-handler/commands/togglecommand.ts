import {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  AutocompleteInteraction,
} from 'discord.js'

import Command from '../Command'
import { CommandUsage } from '../../../typings'
import { CommandType } from '../..'

export default {
  description: 'Toggles a command on or off for your guild',

  type: CommandType.SLASH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  options: [
    {
      name: 'command',
      description: 'The command to toggle on or off',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],

  autocomplete: (command: Command) => {
    return [...command.instance.commandHandler.commands.keys()]
  },

  callback: async (commandUsage: CommandUsage) => {
    const { instance, guild, text: commandName, interaction } = commandUsage

    const { disabledCommands } = instance.commandHandler

    if (disabledCommands.isDisabled(guild!.id, commandName)) {
      await disabledCommands.enable(guild!.id, commandName)

      interaction!.reply(`Command "${commandName}" has been enabled`)
    } else {
      await disabledCommands.disable(guild!.id, commandName)

      interaction!.reply(`Command "${commandName}" has been disabled`)
    }
  },
}
