"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_commands_typeorm_1 = require("../models/channel-commands-typeorm");
const WOK_1 = require("../WOK");
class ChannelCommands {
    // `${guildId}-${commandName}`: [channelIds]
    _channelCommands = new Map();
    _instance;
    constructor(instance) {
        this._instance = instance;
    }
    async action(action, guildId, commandName, channelId) {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        // const ds = this._instance.dataSource;
        const repo = await WOK_1.ds.getRepository(channel_commands_typeorm_1.ChannelCommandsTypeorm);
        if (action == "remove") {
            await repo.delete({
                guildId: guildId,
                commandId: commandName,
                channelId: channelId
            });
        }
        else {
            await repo.insert({
                guildId: guildId,
                commandId: commandName,
                channelId: channelId
            });
        }
        let channels = [];
        const result = await repo.find();
        result.forEach(x => channels.push(x.channelId));
        this._channelCommands.set(_id, channels);
        return channels;
    }
    async add(guildId, commandName, channelId) {
        return await this.action("add", guildId, commandName, channelId);
    }
    async remove(guildId, commandName, channelId) {
        return await this.action("remove", guildId, commandName, channelId);
    }
    async getAvailableChannels(guildId, commandName) {
        if (!this._instance.isConnectedToMariaDB) {
            return [];
        }
        const _id = `${guildId}-${commandName}`;
        let t = this._channelCommands.get(_id);
        let channels = !t ? [] : t;
        if (!channels) {
            // const ds = this._instance.dataSource;
            const result = await WOK_1.ds.getRepository(channel_commands_typeorm_1.ChannelCommandsTypeorm).find();
            result.forEach(x => channels.push(x.channelId));
            if (result.length < 1) {
                this._channelCommands.set(_id, []);
            }
            else {
                this._channelCommands.set(_id, channels);
            }
        }
        // if (!channels) {
        //   const results = await channelCommands.findById(_id);
        //   channels = results ? results.channels : [];
        //   this._channelCommands.set(_id, channels!);
        // }
        return channels;
    }
}
exports.default = ChannelCommands;
