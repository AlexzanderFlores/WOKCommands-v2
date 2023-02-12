import DCMD from "../../typings";
import { ChannelCommandsTypeorm } from "../models/channel-commands-typeorm";
import { ds } from "../DCMD";

class ChannelCommands {
    // `${guildId}-${commandName}`: [channelIds]
    private _channelCommands: Map<string, string[]> = new Map();
    private _instance: DCMD;

    constructor(instance: DCMD) {
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

        const repo = await ds.getRepository(ChannelCommandsTypeorm);

        if (action == "remove") {
            await repo.delete({
                guildId: guildId,
                commandId: commandName,
                channelId: channelId,
            });
        } else {
            await repo.insert({
                guildId: guildId,
                commandId: commandName,
                channelId: channelId,
            });
        }

        let channels: Array<string> = [];
        const result = await repo.find();
        result.forEach((x) => channels.push(x.channelId));

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

        const _id = `${guildId}-${commandName}`;
        let t = this._channelCommands.get(_id);
        let channels: Array<string> = !t ? [] : t;

        if (!channels) {
            const result = await ds
                .getRepository(ChannelCommandsTypeorm)
                .find();
            result.forEach((x) => channels.push(x.channelId));
            if (result.length < 1) {
                this._channelCommands.set(_id, []);
            } else {
                this._channelCommands.set(_id, channels!);
            }
        }

        return channels;
    }
}

export default ChannelCommands;
