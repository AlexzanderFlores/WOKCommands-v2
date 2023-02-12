"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const custom_command_typeorm_1 = require("../models/custom-command-typeorm");
const DCMD_1 = require("../DCMD");
class CustomCommands {
    // guildId-commandName: response
    _customCommands = new Map();
    _commandHandler;
    _instance;
    constructor(instance, commandHandler) {
        this._instance = instance;
        this._commandHandler = commandHandler;
        this.loadCommands();
    }
    async loadCommands() {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        const results = await DCMD_1.ds.getRepository(custom_command_typeorm_1.CustomCommandTypeorm).find();
        for (const result of results) {
            const { guildId, cmdId, response } = result;
            this._customCommands.set(`${guildId}-${cmdId}`, response);
        }
    }
    getCommands(guildId) {
        const commands = [];
        for (const [key] of this._customCommands) {
            const [id, commandName] = key.split("-");
            if (id === guildId) {
                commands.push(commandName);
            }
        }
        return commands;
    }
    async create(guildId, commandName, description, response) {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        const repo = await DCMD_1.ds.getRepository(custom_command_typeorm_1.CustomCommandTypeorm);
        this._customCommands.set(_id, response);
        this._commandHandler.slashCommands.create(commandName, description, [], guildId);
        await repo.insert({
            guildId: guildId,
            cmdId: commandName,
            response: response,
        });
    }
    async delete(guildId, commandName) {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        const repo = await DCMD_1.ds.getRepository(custom_command_typeorm_1.CustomCommandTypeorm);
        this._customCommands.delete(_id);
        this._commandHandler.slashCommands.delete(commandName, guildId);
        await repo.delete({
            guildId: guildId,
            cmdId: commandName,
        });
    }
    async run(commandName, message, interaction) {
        if (!message && !interaction) {
            return;
        }
        const guild = message ? message.guild : interaction.guild;
        if (!guild) {
            return;
        }
        const _id = `${guild.id}-${commandName}`;
        const response = this._customCommands.get(_id);
        if (!response) {
            return;
        }
        if (message)
            message.channel.send(response).catch(() => { });
        else if (interaction)
            interaction.reply(response).catch(() => { });
    }
}
exports.default = CustomCommands;
