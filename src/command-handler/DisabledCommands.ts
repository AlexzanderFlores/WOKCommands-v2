import disabledCommandSchema from '../models/disabled-commands-schema'

class DisabledCommands {
  // array of `${guildId}-${commandName}`
  private _disabledCommands: string[] = []

  constructor() {
    this.loadDisabledCommands()
  }

  async loadDisabledCommands() {
    const results = await disabledCommandSchema.find({})

    for (const result of results) {
      this._disabledCommands.push(result._id)
    }
  }

  async disable(guildId: string, commandName: string) {
    if (this.isDisabled(guildId, commandName)) {
      return
    }

    const _id = `${guildId}-${commandName}`
    this._disabledCommands.push(_id)

    try {
      await new disabledCommandSchema({
        _id,
      }).save()
    } catch (ignored) {}
  }

  async enable(guildId: string, commandName: string) {
    if (!this.isDisabled(guildId, commandName)) {
      return
    }

    const _id = `${guildId}-${commandName}`
    this._disabledCommands = this._disabledCommands.filter((id) => id !== _id)

    await disabledCommandSchema.deleteOne({ _id })
  }

  isDisabled(guildId: string, commandName: string) {
    return this._disabledCommands.includes(`${guildId}-${commandName}`)
  }
}

export default DisabledCommands
