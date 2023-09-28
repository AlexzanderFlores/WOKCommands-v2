import Command from '../../Command'
import { CommandUsage } from '../../../types'

export default async (command: Command, usage: CommandUsage) => {
  const { commandName, instance } = command
  const { guild, message, interaction } = usage

  if (!guild || !instance.isConnectedToDB) {
    return true
  }

  if (
    instance.commandHandler?.disabledCommands.isDisabled(guild.id, commandName)
  ) {
    const content = 'This command is disabled'

    if (message) {
      message.channel.send({ content })
    } else if (interaction) {
      interaction.reply({ content, ephemeral: true })
    }

    return false
  }

  return true
}
