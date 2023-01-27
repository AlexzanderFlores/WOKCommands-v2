"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guild_prefix_typeorm_1 = require("../models/guild-prefix-typeorm");
class PrefixHandler {
    // <guildId: prefix>
    _prefixes = new Map();
    _defaultPrefix = "!";
    _instance;
    constructor(instance) {
        this._instance = instance;
        this.loadPrefixes();
    }
    async loadPrefixes() {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        // const results = await guildPrefixSchema.find({});
        const results = await (0, guild_prefix_typeorm_1.findPrefixes)();
        for (const result of results) {
            this._prefixes.set(result.guildId, result.prefix);
        }
    }
    get defaultPrefix() {
        return this._defaultPrefix;
    }
    get(guildId) {
        if (!guildId) {
            return this.defaultPrefix;
        }
        return this._prefixes.get(guildId) || this.defaultPrefix;
    }
    async set(guildId, prefix) {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        this._prefixes.set(guildId, prefix);
        await (0, guild_prefix_typeorm_1.setPrefix)(guildId, prefix);
        // await guildPrefixSchema.findOneAndUpdate(
        //   {
        //     _id: guildId,
        //   },
        //   {
        //     _id: guildId,
        //     prefix,
        //   },
        //   {
        //     upsert: true,
        //   }
        // );
    }
}
exports.default = PrefixHandler;
