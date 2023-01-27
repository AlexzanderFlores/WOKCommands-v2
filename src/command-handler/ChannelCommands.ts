import WOK from "../../typings";
import channelCommands from "../models/channel-commands-schema";
import {ChannelCommandsTypeorm} from "../models/channel-commands-typeorm";

class ChannelCommands {
  // `${guildId}-${commandName}`: [channelIds]
  private _channelCommands: Map<string, string[]> = new Map();
  private _instance: WOK;

  constructor(instance: WOK) {
    this._instance = instance;
  }

  async action(
    action: "add" | "remove",
    guildId: string,
    commandName: string,
    channelId: string
  ) {
    if (!this._instance.isConnectedToMariaDB) {
      return;
    }

    const _id = `${guildId}-${commandName}`;

    const ds = this._instance.dataSource;
    const repo = await ds.getRepository(ChannelCommandsTypeorm)

    if (action == "add") {
      await repo.delete({
        commandId: _id
      })
    } else {
      await repo.insert({
        commandId: _id,
        channelId: channelId
      })
    }

    let channels: Array<string> = [];
    const result = await repo.find()
    result.forEach(x => channels.push(x.channelId))

    this._channelCommands.set(_id, channels);
    return channels;
  }

  async add(guildId: string, commandName: string, channelId: string) {
    return await this.action("add", guildId, commandName, channelId);
  }

  async remove(guildId: string, commandName: string, channelId: string) {
    return await this.action("remove", guildId, commandName, channelId);
  }

  async getAvailableChannels(guildId: string, commandName: string) {
    if (!this._instance.isConnectedToMariaDB) {
      return [];
    }

    const _id = `${guildId}-${commandName}`
    let t = this._channelCommands.get(_id);
    let channels: Array<string> = !t ? [] : t;

    if (!channels) {
      const ds = this._instance.dataSource;
      const result = await ds.getRepository(ChannelCommandsTypeorm).find()
      result.forEach(x => channels.push(x.channelId))
      this._channelCommands.set(_id, channels!)
    }

    // if (!channels) {
    //   const results = await channelCommands.findById(_id);
    //   channels = results ? results.channels : [];
    //   this._channelCommands.set(_id, channels!);
    // }

    return channels;
  }
}

export default ChannelCommands;
