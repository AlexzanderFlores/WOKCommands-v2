import { PermissionFlagsBits } from 'discord.js'
import { CommandType } from '../..'

import { CommandObject, CommandUsage } from '../../../typings'

export default {
  description: 'Sets the prefix for this server',

  minArgs: 1,
  syntaxError: 'Correct syntax: {PREFIX}prefix {ARGS}',
  expectedArgs: '<prefix>',

  type: CommandType.BOTH,
  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  callback: (commandUsage: CommandUsage) => {
    const { instance, guild, text: prefix } = commandUsage

    instance.commandHandler.prefixHandler.set(guild!.id, prefix)

    return `Set "${prefix}" as the command prefix for this server.`
  },
} as CommandObject
