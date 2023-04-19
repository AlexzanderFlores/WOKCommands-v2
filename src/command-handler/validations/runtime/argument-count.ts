import Command from '../../Command'
import { CommandUsage } from '../../../../typings'

export default (command: Command, usage: CommandUsage, prefix: string) => {
  const {
    minArgs = 0,
    maxArgs = -1,
    correctSyntax = 'Correct syntax: {PREFIX}{COMMAND} {ARGS}',
    expectedArgs = '',
  } = command.commandObject

  const { length } = usage.args!

  if (length < minArgs || (length > maxArgs && maxArgs !== -1)) {
    const content = correctSyntax
      .replace('{PREFIX}', prefix)
      .replace('{COMMAND}', command.commandName)
      .replace('{ARGS}', expectedArgs)

    const { message, interaction } = usage

    if (message) {
      message.reply({
        content,
      })
    } else if (interaction) {
      interaction.reply({
        content,
        ephemeral: true,
      })
    }

    return false
  }

  return true
}
