import Command from '../../Command'
import { CommandUsage } from '../../../types'

export default (command: Command, usage: CommandUsage) => {
  const { guildOnly } = command.commandObject
  const { guild, message, interaction } = usage

  if (guildOnly === true && !guild) {
    const content = 'This command can only be ran within a guild/server.'

    if (message) {
      message.reply({ content })
    } else if (interaction) {
      interaction.reply({ content, ephemeral: true })
    }

    return false
  }

  return true
}
