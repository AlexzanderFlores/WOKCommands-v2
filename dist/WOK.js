"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ds = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommandHandler_1 = __importDefault(require("./command-handler/CommandHandler"));
const EventHandler_1 = __importDefault(require("./event-handler/EventHandler"));
const Cooldowns_1 = __importDefault(require("./util/Cooldowns"));
const FeaturesHandler_1 = __importDefault(require("./util/FeaturesHandler"));
const typeorm_1 = require("typeorm");
const index_model_1 = __importDefault(require("./models/index-model"));
class WOKCommands {
    _client;
    _testServers;
    _botOwners;
    _cooldowns;
    _disabledDefaultCommands;
    _validations;
    _commandHandler;
    _eventHandler;
    _isConnectedToDB = false;
    _isConnectedToMariaDB = false;
    _dataSource;
    constructor(options) {
        this.init(options);
    }
    async init(options) {
        let { client, mongoUri, dataSource, commandsDir, featuresDir, testServers = [], botOwners = [], cooldownConfig, disabledDefaultCommands = [], events = {}, validations = {}, } = options;
        if (!client) {
            throw new Error('A client is required.');
        }
        if (mongoUri) {
            await this.connectToMongo(mongoUri);
        }
        // if (dataSource) {
        await this.connectToMaria(undefined);
        // }
        // Add the bot owner's ID
        if (botOwners.length === 0) {
            await client.application?.fetch();
            const ownerId = client.application?.owner?.id;
            if (ownerId && botOwners.indexOf(ownerId) === -1) {
                botOwners.push(ownerId);
            }
        }
        this._client = client;
        this._testServers = testServers;
        this._botOwners = botOwners;
        this._disabledDefaultCommands = disabledDefaultCommands;
        this._validations = validations;
        // this._dataSource = dataSource!
        this._cooldowns = new Cooldowns_1.default(this, {
            errorMessage: 'Please wait {TIME} before doing that again.',
            botOwnersBypass: false,
            dbRequired: 300,
            ...cooldownConfig,
        });
        if (commandsDir) {
            this._commandHandler = new CommandHandler_1.default(this, commandsDir, client);
        }
        if (featuresDir) {
            new FeaturesHandler_1.default(this, featuresDir, client);
        }
        this._eventHandler = new EventHandler_1.default(this, events, client);
    }
    get client() {
        return this._client;
    }
    get testServers() {
        return this._testServers;
    }
    get botOwners() {
        return this._botOwners;
    }
    get cooldowns() {
        return this._cooldowns;
    }
    get disabledDefaultCommands() {
        return this._disabledDefaultCommands;
    }
    get commandHandler() {
        return this._commandHandler;
    }
    get eventHandler() {
        return this._eventHandler;
    }
    get validations() {
        return this._validations;
    }
    get isConnectedToDB() {
        return this._isConnectedToDB;
    }
    get isConnectedToMariaDB() {
        return this._isConnectedToMariaDB;
    }
    async connectToMaria(dataSource) {
        exports.ds = new typeorm_1.DataSource({
            type: "mariadb",
            host: process.env.MARIADB_HOST,
            port: Number(process.env.MARIADB_PORT),
            username: process.env.MARIADB_USERNAME,
            password: process.env.MARIADB_PASSWORD,
            database: process.env.MARIADB_DATABASE,
            synchronize: process.env.LIVE != 'true',
            entities: index_model_1.default,
        });
        await exports.ds.initialize();
        this._isConnectedToMariaDB = true;
    }
    async connectToMongo(mongoUri) {
        await mongoose_1.default.connect(mongoUri, {
            keepAlive: true,
        });
        this._isConnectedToDB = true;
    }
}
exports.default = WOKCommands;
