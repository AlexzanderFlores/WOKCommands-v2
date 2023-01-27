"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const get_all_files_1 = __importDefault(require("../util/get-all-files"));
class EventHandler {
    // <eventName, array of [function, dynamic validation functions]>
    _eventCallbacks = new Map();
    _instance;
    _eventsDir;
    _client;
    _events;
    _builtInEvents;
    constructor(instance, events, client) {
        this._instance = instance;
        this._eventsDir = events?.dir;
        this._events = events;
        this._client = client;
        this._builtInEvents = {
            interactionCreate: {
                isButton: (interaction) => interaction.isButton(),
                isCommand: (interaction) => interaction.type === discord_js_1.InteractionType.ApplicationCommand,
                isAutocomplete: (interaction) => interaction.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete,
            },
            messageCreate: {
                isHuman: (message) => !message.author.bot,
            },
        };
        this.readFiles();
        this.registerEvents();
    }
    async readFiles() {
        const defaultEvents = (0, get_all_files_1.default)(path_1.default.join(__dirname, "events"), true);
        const folders = this._eventsDir ? (0, get_all_files_1.default)(this._eventsDir, true) : [];
        for (const { filePath: folderPath } of [...defaultEvents, ...folders]) {
            const event = folderPath.split(/[\/\\]/g).pop();
            const files = (0, get_all_files_1.default)(folderPath);
            const functions = this._eventCallbacks.get(event) || [];
            for (const { filePath, fileContents } of files) {
                const isBuiltIn = !folderPath.includes(this._eventsDir);
                const result = [fileContents];
                const split = filePath.split(event)[1].split(/[\/\\]/g);
                const methodName = split[split.length - 2];
                if (isBuiltIn &&
                    this._builtInEvents[event] &&
                    this._builtInEvents[event][methodName]) {
                    result.push(this._builtInEvents[event][methodName]);
                }
                else if (this._events[event] && this._events[event][methodName]) {
                    result.push(this._events[event][methodName]);
                }
                functions.push(result);
            }
            this._eventCallbacks.set(event, functions);
        }
    }
    registerEvents() {
        const instance = this._instance;
        for (const eventName of this._eventCallbacks.keys()) {
            const functions = this._eventCallbacks.get(eventName);
            this._client.on(eventName, async function () {
                for (const [func, dynamicValidation] of functions) {
                    if (dynamicValidation && !(await dynamicValidation(...arguments))) {
                        continue;
                    }
                    func(...arguments, instance);
                }
            });
        }
    }
}
exports.default = EventHandler;
