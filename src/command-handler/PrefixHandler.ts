import guildPrefixSchema from "../models/guild-prefix-schema";
import WOK from "../../typings";

class PrefixHandler {
  // <guildId: prefix>
  private _prefixes = new Map();
  private _defaultPrefix = "!";
  private _instance: WOK;

  constructor(instance: WOK) {
    this._instance = instance;

    this.loadPrefixes();
  }

  private async loadPrefixes() {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const results = await guildPrefixSchema.find({});

    for (const result of results) {
      this._prefixes.set(result._id, result.prefix);
    }
  }

  public get defaultPrefix() {
    return this._defaultPrefix;
  }

  public get(guildId?: string) {
    if (!guildId) {
      return this.defaultPrefix;
    }

    return this._prefixes.get(guildId) || this.defaultPrefix;
  }

  public async set(guildId: string, prefix: string) {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    this._prefixes.set(guildId, prefix);

    await guildPrefixSchema.findOneAndUpdate(
      {
        _id: guildId,
      },
      {
        _id: guildId,
        prefix,
      },
      {
        upsert: true,
      }
    );
  }
}

export default PrefixHandler;
