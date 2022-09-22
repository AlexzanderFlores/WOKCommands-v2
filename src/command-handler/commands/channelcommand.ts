import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  CommandInteraction,
} from 'discord.js'

import Command from '../Command'
import { CommandObject, CommandUsage } from '../../../typings'
import { CommandType } from '../..'

export default {
  description: 'Specifies what commands can be ran inside of what channels',

  type: CommandType.SLASH,
  guildOnly: true,

  options: [
    {
      name: 'command',
      description: 'The command to restrict to specific channels',
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
    },
    {
      name: 'channel',
      description: 'The channel to use for this command',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    },
  ],

  autocomplete: (command: Command) => {
    return [...command.instance.commandHandler.commands.keys()]
  },

  callback: async (commandUsage: CommandUsage) => {
    const { instance, guild } = commandUsage
    const interaction: CommandInteraction = commandUsage.interaction!

    // @ts-ignore
    const commandName = interaction.options.getString('command')
    // @ts-ignore
    const channel = interaction.options.getChannel('channel')

    const command = instance.commandHandler.commands.get(
      commandName.toLowerCase()
    )
    if (!command) {
      return `The command "${commandName}" does not exist.`
    }

    const { channelCommands } = instance.commandHandler

    let availableChannels = []
    const canRun = (
      await channelCommands.getAvailableChannels(guild!.id, commandName)
    ).includes(channel.id)

    if (canRun) {
      availableChannels = await channelCommands.remove(
        guild!.id,
        commandName,
        channel.id
      )
    } else {
      availableChannels = await channelCommands.add(
        guild!.id,
        commandName,
        channel.id
      )
    }

    if (availableChannels.length) {
      const channelNames = availableChannels.map((c: string) => `<#${c}> `)
      return `The command "${commandName}" can now only be ran inside of the following channels: ${channelNames}`
    }

    return `The command "${commandName}" can now be ran inside of any text channel.`
  },
} as CommandObject
