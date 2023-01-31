"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CooldownTypes_1 = __importDefault(require("../util/CooldownTypes"));
const cooldown_typeorm_1 = require("../models/cooldown-typeorm");
const typeorm_1 = require("typeorm");
const WOK_1 = require("../WOK");
const cooldownDurations = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
};
class Cooldowns {
    _cooldowns = new Map();
    _instance;
    _errorMessage;
    _botOwnersBypass;
    _dbRequired;
    constructor(instance, cooldownConfig) {
        const { errorMessage, botOwnersBypass, dbRequired } = cooldownConfig;
        this._instance = instance;
        this._errorMessage = errorMessage;
        this._botOwnersBypass = botOwnersBypass;
        this._dbRequired = dbRequired;
        this.loadCooldowns();
    }
    async loadCooldowns() {
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        const repo = await WOK_1.ds.getRepository(cooldown_typeorm_1.CooldownTypeorm);
        await repo.delete({
            expires: (0, typeorm_1.LessThan)(new Date()),
        });
        const results = await repo.find();
        for (const result of results) {
            const _id = `${result.guildId}-${result.cmdId}`;
            const expires = result.expires;
            this._cooldowns.set(_id, expires);
        }
    }
    getKeyFromCooldownUsage(cooldownUsage) {
        const { cooldownType, userId, actionId, guildId } = cooldownUsage;
        return this.getKey(cooldownType, userId, actionId, guildId);
    }
    async cancelCooldown(cooldownUsage) {
        const key = this.getKeyFromCooldownUsage(cooldownUsage);
        this._cooldowns.delete(key);
        if (this._instance.isConnectedToMariaDB) {
            // await cooldownSchema.deleteOne({ _id: key });
            // const ds = this._instance.dataSource;
            const repo = await WOK_1.ds.getRepository(cooldown_typeorm_1.CooldownTypeorm);
            await repo.delete({
                guildId: key.split("-")[0],
                cmdId: key.split("-")[1],
            });
        }
    }
    async updateCooldown(cooldownUsage, expires) {
        const key = this.getKeyFromCooldownUsage(cooldownUsage);
        this._cooldowns.set(key, expires);
        if (!this._instance.isConnectedToMariaDB) {
            return;
        }
        const now = new Date();
        const secondsDiff = (expires.getTime() - now.getTime()) / 1000;
        if (secondsDiff > this._dbRequired) {
            // const ds = this._instance.dataSource;
            const repo = await WOK_1.ds.getRepository(cooldown_typeorm_1.CooldownTypeorm);
            await repo.update({
                guildId: key.split("-")[0],
                cmdId: key.split("-")[1],
            }, {
                expires: expires,
            });
        }
    }
    verifyCooldown(duration) {
        if (typeof duration === "number") {
            return duration;
        }
        const split = duration.split(" ");
        if (split.length !== 2) {
            throw new Error(`Duration "${duration}" is an invalid duration. Please use "10 m", "15 s" etc.`);
        }
        const quantity = +split[0];
        const type = split[1].toLowerCase();
        if (!cooldownDurations[type]) {
            throw new Error(`Unknown duration type "${type}". Please use one of the following: ${Object.keys(cooldownDurations)}`);
        }
        if (quantity <= 0) {
            throw new Error(`Invalid quantity of "${quantity}". Please use a value greater than 0.`);
        }
        return quantity * cooldownDurations[type];
    }
    getKey(cooldownType, userId, actionId, guildId) {
        const isPerUser = cooldownType === CooldownTypes_1.default.perUser;
        const isPerUserPerGuild = cooldownType === CooldownTypes_1.default.perUserPerGuild;
        const isPerGuild = cooldownType === CooldownTypes_1.default.perGuild;
        const isGlobal = cooldownType === CooldownTypes_1.default.global;
        if ((isPerUserPerGuild || isPerGuild) && !guildId) {
            throw new Error(`Invalid cooldown type "${cooldownType}" used outside of a guild.`);
        }
        if (isPerUser) {
            return `${userId}-${actionId}`;
        }
        if (isPerUserPerGuild) {
            return `${userId}-${guildId}-${actionId}`;
        }
        if (isPerGuild) {
            return `${guildId}-${actionId}`;
        }
        if (isGlobal) {
            return actionId;
        }
        return "ERROR";
    }
    canBypass(userId) {
        return (this._botOwnersBypass && this._instance.botOwners.includes(userId));
    }
    async start(cooldownUsage) {
        const { cooldownType, userId, actionId, guildId = "", duration, } = cooldownUsage;
        if (this.canBypass(userId)) {
            return;
        }
        const seconds = this.verifyCooldown(duration);
        const key = this.getKey(cooldownType, userId, actionId, guildId);
        const expires = new Date();
        expires.setSeconds(expires.getSeconds() + seconds);
        if (this._instance.isConnectedToMariaDB &&
            seconds >= this._dbRequired) {
            // const ds = this._instance.dataSource;
            const repo = await WOK_1.ds.getRepository(cooldown_typeorm_1.CooldownTypeorm);
            await repo.update({
                guildId: key.split("-")[0],
                cmdId: key.split("-")[1],
            }, {
                expires: expires,
            });
        }
        this._cooldowns.set(key, expires);
    }
    canRunAction(cooldownUsage) {
        const { cooldownType, userId, actionId, guildId = "", errorMessage = this._errorMessage, } = cooldownUsage;
        if (this.canBypass(userId)) {
            return true;
        }
        const key = this.getKey(cooldownType, userId, actionId, guildId);
        const expires = this._cooldowns.get(key);
        if (!expires) {
            return true;
        }
        const now = new Date();
        if (now > expires) {
            this._cooldowns.delete(key);
            return true;
        }
        const secondsDiff = (expires.getTime() - now.getTime()) / 1000;
        const d = Math.floor(secondsDiff / (3600 * 24));
        const h = Math.floor((secondsDiff % (3600 * 24)) / 3600);
        const m = Math.floor((secondsDiff % 3600) / 60);
        const s = Math.floor(secondsDiff % 60);
        let time = "";
        if (d > 0)
            time += `${d}d `;
        if (h > 0)
            time += `${h}h `;
        if (m > 0)
            time += `${m}m `;
        time += `${s}s`;
        return errorMessage.replace("{TIME}", time);
    }
}
exports.default = Cooldowns;
