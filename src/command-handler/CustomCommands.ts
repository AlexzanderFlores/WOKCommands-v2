import { CommandInteraction, Message } from "discord.js";

import CommandHandler from "./CommandHandler";
import WOK from "../../typings";
import { CustomCommandTypeorm } from "../models/custom-command-typeorm";
import { ds } from "../WOK";

class CustomCommands {
    // guildId-commandName: response
    private _customCommands = new Map();
    private _commandHandler: CommandHandler;
    private _instance: WOK;

    constructor(instance: WOK, commandHandler: CommandHandler) {
        this._instance = instance;
        this._commandHandler = commandHandler;

        this.loadCommands();
    }

    async loadCommands() {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }

        const results = await ds.getRepository(CustomCommandTypeorm).find();

        for (const result of results) {
            const { guildId, cmdId, response } = result;
            this._customCommands.set(`${guildId}-${cmdId}`, response);
        }
    }

    getCommands(guildId: string) {
        const commands = [];

        for (const [key] of this._customCommands) {
            const [id, commandName] = key.split("-");
            if (id === guildId) {
                commands.push(commandName);
            }
        }

        return commands;
    }

    async create(
        guildId: string,
        commandName: string,
        description: string,
        response: string
    ) {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }

        const _id = `${guildId}-${commandName}`;
        const repo = await ds.getRepository(CustomCommandTypeorm);

        this._customCommands.set(_id, response);

        this._commandHandler.slashCommands.create(
            commandName,
            description,
            [],
            guildId
        );

        await repo.insert({
            guildId: guildId,
            cmdId: commandName,
            response: response,
        });
    }

    async delete(guildId: string, commandName: string) {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }

        const _id = `${guildId}-${commandName}`;
        const repo = await ds.getRepository(CustomCommandTypeorm);

        this._customCommands.delete(_id);

        this._commandHandler.slashCommands.delete(commandName, guildId);

        await repo.delete({
            guildId: guildId,
            cmdId: commandName,
        });
    }

    async run(
        commandName: string,
        message: Message | null,
        interaction: CommandInteraction | null
    ) {
        if (!message && !interaction) {
            return;
        }

        const guild = message ? message.guild : interaction!.guild;
        if (!guild) {
            return;
        }

        const _id = `${guild.id}-${commandName}`;
        const response = this._customCommands.get(_id);
        if (!response) {
            return;
        }

        if (message) message.channel.send(response).catch(() => {});
        else if (interaction) interaction.reply(response).catch(() => {});
    }
}

export default CustomCommands;
