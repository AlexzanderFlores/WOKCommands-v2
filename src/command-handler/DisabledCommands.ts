import disabledCommandSchema from "../models/disabled-commands-schema";
import WOK from "../../typings";

class DisabledCommands {
  // array of `${guildId}-${commandName}`
  private _disabledCommands: string[] = [];
  private _instance: WOK;

  constructor(instance: WOK) {
    this._instance = instance;

    this.loadDisabledCommands();
  }

  async loadDisabledCommands() {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const results = await disabledCommandSchema.find({});

    for (const result of results) {
      this._disabledCommands.push(result._id);
    }
  }

  async disable(guildId: string, commandName: string) {
    if (
      !this._instance.isConnectedToDB ||
      this.isDisabled(guildId, commandName)
    ) {
      return;
    }

    const _id = `${guildId}-${commandName}`;
    this._disabledCommands.push(_id);

    try {
      await new disabledCommandSchema({
        _id,
      }).save();
    } catch (ignored) {}
  }

  async enable(guildId: string, commandName: string) {
    if (
      !this._instance.isConnectedToDB ||
      !this.isDisabled(guildId, commandName)
    ) {
      return;
    }

    const _id = `${guildId}-${commandName}`;
    this._disabledCommands = this._disabledCommands.filter((id) => id !== _id);

    await disabledCommandSchema.deleteOne({ _id });
  }

  isDisabled(guildId: string, commandName: string) {
    return this._disabledCommands.includes(`${guildId}-${commandName}`);
  }
}

export default DisabledCommands;
