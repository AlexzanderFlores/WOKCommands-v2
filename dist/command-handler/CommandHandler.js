"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
const Command_1 = __importDefault(require("./Command"));
const SlashCommands_1 = __importDefault(require("./SlashCommands"));
const ChannelCommands_1 = __importDefault(require("./ChannelCommands"));
const CustomCommands_1 = __importDefault(require("./CustomCommands"));
const DisabledCommands_1 = __importDefault(require("./DisabledCommands"));
const PrefixHandler_1 = __importDefault(require("./PrefixHandler"));
const CommandType_1 = __importDefault(require("../util/CommandType"));
const DefaultCommands_1 = __importDefault(require("../util/DefaultCommands"));
class CommandHandler {
    // <commandName, instance of the Command class>
    _commands = new Map();
    _validations = this.getValidations(path_1.default.join(__dirname, "validations", "runtime"));
    _instance;
    _client;
    _commandsDir;
    _slashCommands;
    _channelCommands;
    _customCommands;
    _disabledCommands;
    _prefixes;
    constructor(instance, commandsDir, client) {
        this._instance = instance;
        this._commandsDir = commandsDir;
        this._slashCommands = new SlashCommands_1.default(client);
        this._client = client;
        this._channelCommands = new ChannelCommands_1.default(instance);
        this._customCommands = new CustomCommands_1.default(instance, this);
        this._disabledCommands = new DisabledCommands_1.default(instance);
        this._prefixes = new PrefixHandler_1.default(instance);
        this._validations = [
            ...this._validations,
            ...this.getValidations(instance.validations?.runtime), // Todo: validace
        ];
        this.readFiles();
    }
    get commands() {
        return this._commands;
    }
    get channelCommands() {
        return this._channelCommands;
    }
    get slashCommands() {
        return this._slashCommands;
    }
    get customCommands() {
        return this._customCommands;
    }
    get disabledCommands() {
        return this._disabledCommands;
    }
    get prefixHandler() {
        return this._prefixes;
    }
    async readFiles() {
        const defaultCommands = (0, get_all_files_1.default)(path_1.default.join(__dirname, "./commands"));
        const files = (0, get_all_files_1.default)(this._commandsDir);
        const validations = [
            ...this.getValidations(path_1.default.join(__dirname, "validations", "syntax")),
            ...this.getValidations(this._instance.validations?.syntax),
        ];
        for (let fileData of [...defaultCommands, ...files]) {
            const { filePath } = fileData;
            const commandObject = fileData.fileContents;
            const split = filePath.split(/[\/\\]/);
            let commandName = split.pop();
            commandName = commandName.split(".")[0];
            const command = new Command_1.default(this._instance, commandName, commandObject);
            const { description, type, testOnly, delete: del, aliases = [], init = () => { }, } = commandObject;
            let defaultCommandValue;
            for (const [key, value] of Object.entries(DefaultCommands_1.default)) {
                if (value === commandName.toLowerCase()) {
                    defaultCommandValue =
                        DefaultCommands_1.default[key];
                    break;
                }
            }
            if (del ||
                (defaultCommandValue &&
                    this._instance.disabledDefaultCommands.includes(defaultCommandValue))) {
                if (type === "SLASH" || type === "BOTH") {
                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.delete(command.commandName, guildId);
                        }
                    }
                    else {
                        this._slashCommands.delete(command.commandName);
                    }
                }
                continue;
            }
            for (const validation of validations) {
                validation(command);
            }
            await init(this._client, this._instance);
            const names = [command.commandName, ...aliases];
            for (const name of names) {
                this._commands.set(name, command);
            }
            if (type === "SLASH" || type === "BOTH") {
                const options = commandObject.options ||
                    this._slashCommands.createOptions(commandObject);
                if (testOnly) {
                    for (const guildId of this._instance.testServers) {
                        this._slashCommands.create(command.commandName, description, options, guildId);
                    }
                }
                else {
                    this._slashCommands.create(command.commandName, description, options);
                }
            }
        }
    }
    async runCommand(command, args, message, interaction) {
        const { callback, type, cooldowns } = command.commandObject;
        if (message && type === CommandType_1.default.SLASH) {
            return;
        }
        const guild = message ? message.guild : interaction?.guild;
        const member = (message ? message.member : interaction?.member);
        const user = message ? message.author : interaction?.user;
        const channel = (message ? message.channel : interaction?.channel);
        const usage = {
            client: command.instance.client,
            instance: command.instance,
            message,
            interaction,
            args,
            text: args.join(" "),
            guild,
            member,
            user: user,
            channel,
        };
        for (const validation of this._validations) {
            if (!(await validation(command, usage, this._prefixes.get(guild?.id)))) {
                return;
            }
        }
        if (cooldowns) {
            const cooldownUsage = {
                cooldownType: cooldowns.type,
                userId: user.id,
                actionId: `command_${command.commandName}`,
                guildId: guild?.id,
                duration: cooldowns.duration,
                errorMessage: cooldowns.errorMessage,
            };
            const result = this._instance.cooldowns?.canRunAction(cooldownUsage);
            if (typeof result === "string") {
                return result;
            }
            await this._instance.cooldowns?.start(cooldownUsage);
            usage.cancelCooldown = () => {
                this._instance.cooldowns?.cancelCooldown(cooldownUsage);
            };
            usage.updateCooldown = (expires) => {
                this._instance.cooldowns?.updateCooldown(cooldownUsage, expires);
            };
        }
        return await callback(usage);
    }
    getValidations(folder) {
        if (!folder) {
            return [];
        }
        return (0, get_all_files_1.default)(folder).map((fileData) => fileData.fileContents);
    }
}
exports.default = CommandHandler;
