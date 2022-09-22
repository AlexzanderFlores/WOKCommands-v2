import { PermissionFlagsBits } from 'discord.js'
import { CommandType } from '../..'

import { CommandObject, CommandUsage } from '../../../typings'

export default {
  description: 'Deletes a custom command',

  minArgs: 1,
  syntaxError: 'Correct syntax: {PREFIX}delCustomCmd {ARGS}',
  expectedArgs: '<command name>',

  type: CommandType.SLASH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  callback: async (commandUsage: CommandUsage) => {
    const { instance, text: commandName, guild } = commandUsage

    await instance.commandHandler.customCommands.delete(guild!.id, commandName)

    return `Custom command "${commandName}" has been deleted!`
  },
} as CommandObject
