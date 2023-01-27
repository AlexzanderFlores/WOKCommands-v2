import cooldownSchema from "../models/cooldown-schema";
import CooldownTypes from "../util/CooldownTypes";
import WOK, { CooldownConfig, InternalCooldownConfig } from "../../typings";
import {RequiredRolesTypeorm} from "../models/required-roles-typeorm";
import {CooldownTypeorm} from "../models/cooldown-typeorm";
import {LessThan, MoreThan} from "typeorm";

const cooldownDurations = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
} as { [key: string]: number };

class Cooldowns {
  private _cooldowns: Map<string, Date> = new Map();
  private _instance: WOK;
  private _errorMessage: string;
  private _botOwnersBypass: boolean;
  private _dbRequired: number;

  constructor(instance: WOK, cooldownConfig: CooldownConfig) {
    const { errorMessage, botOwnersBypass, dbRequired } = cooldownConfig;

    this._instance = instance;
    this._errorMessage = errorMessage;
    this._botOwnersBypass = botOwnersBypass;
    this._dbRequired = dbRequired;

    this.loadCooldowns();
  }

  private async loadCooldowns() {
    if (!this._instance.isConnectedToMariaDB) {
      return;
    }

    const ds = this._instance.dataSource;
    const repo = await ds.getRepository(CooldownTypeorm);

    // await cooldownSchema.deleteMany({
    //   expires: { $lt: new Date() },
    // });
    await repo.delete({
      expires: LessThan(new Date())
    })

    // const results = await cooldownSchema.find({});
    const results = await repo.find();

    for (const result of results) {
      // const { _id, expires } = result;
      const _id = `${result.guildId}-${result.cmdId}`
      const expires = result.expires

      this._cooldowns.set(_id, expires);
    }
  }

  public getKeyFromCooldownUsage(cooldownUsage: InternalCooldownConfig) {
    const { cooldownType, userId, actionId, guildId } = cooldownUsage;

    return this.getKey(cooldownType, userId, actionId, guildId);
  }

  public async cancelCooldown(cooldownUsage: InternalCooldownConfig) {
    const key = this.getKeyFromCooldownUsage(cooldownUsage);

    this._cooldowns.delete(key);

    if (this._instance.isConnectedToMariaDB) {
      // await cooldownSchema.deleteOne({ _id: key });
      const ds = this._instance.dataSource;
      const repo = await ds.getRepository(CooldownTypeorm);
      await repo.delete({
        guildId: key.split("-")[0],
        cmdId: key.split("-")[1]
      })
    }
  }

  public async updateCooldown(
    cooldownUsage: InternalCooldownConfig,
    expires: Date
  ) {
    const key = this.getKeyFromCooldownUsage(cooldownUsage);

    this._cooldowns.set(key, expires);

    if (!this._instance.isConnectedToMariaDB) {
      return;
    }

    const now = new Date();
    const secondsDiff = (expires.getTime() - now.getTime()) / 1000;

    if (secondsDiff > this._dbRequired) {
      const ds = this._instance.dataSource;
      const repo = await ds.getRepository(CooldownTypeorm);

      await repo.update({
        guildId: key.split("-")[0],
        cmdId: key.split("-")[1]
      }, {
        expires: expires
      })
      // await cooldownSchema.findOneAndUpdate(
      //   {
      //     _id: key,
      //   },
      //   {
      //     _id: key,
      //     expires,
      //   },
      //   {
      //     upsert: true,
      //   }
      // );
    }
  }

  public verifyCooldown(duration: number | string) {
    if (typeof duration === "number") {
      return duration;
    }

    const split = duration.split(" ");

    if (split.length !== 2) {
      throw new Error(
        `Duration "${duration}" is an invalid duration. Please use "10 m", "15 s" etc.`
      );
    }

    const quantity = +split[0];
    const type = split[1].toLowerCase();

    if (!cooldownDurations[type]) {
      throw new Error(
        `Unknown duration type "${type}". Please use one of the following: ${Object.keys(
          cooldownDurations
        )}`
      );
    }

    if (quantity <= 0) {
      throw new Error(
        `Invalid quantity of "${quantity}". Please use a value greater than 0.`
      );
    }

    return quantity * cooldownDurations[type];
  }

  public getKey(
    cooldownType: CooldownTypes,
    userId: string,
    actionId: string,
    guildId?: string
  ): string {
    const isPerUser = cooldownType === CooldownTypes.perUser;
    const isPerUserPerGuild = cooldownType === CooldownTypes.perUserPerGuild;
    const isPerGuild = cooldownType === CooldownTypes.perGuild;
    const isGlobal = cooldownType === CooldownTypes.global;

    if ((isPerUserPerGuild || isPerGuild) && !guildId) {
      throw new Error(
        `Invalid cooldown type "${cooldownType}" used outside of a guild.`
      );
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

  public canBypass(userId: string) {
    return this._botOwnersBypass && this._instance.botOwners.includes(userId);
  }

  public async start(cooldownUsage: InternalCooldownConfig) {
    const {
      cooldownType,
      userId,
      actionId,
      guildId = "",
      duration,
    } = cooldownUsage;

    if (this.canBypass(userId)) {
      return;
    }

    const seconds = this.verifyCooldown(duration!);

    const key = this.getKey(cooldownType, userId, actionId, guildId);

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + seconds);

    if (this._instance.isConnectedToMariaDB && seconds >= this._dbRequired) {
      const ds = this._instance.dataSource;
      const repo = await ds.getRepository(CooldownTypeorm);

      await repo.update({
        guildId: key.split("-")[0],
        cmdId: key.split("-")[1]
      }, {
        expires: expires
      })
      // await cooldownSchema.findOneAndUpdate(
      //   {
      //     _id: key,
      //   },
      //   {
      //     _id: key,
      //     expires,
      //   },
      //   {
      //     upsert: true,
      //   }
      // );
    }

    this._cooldowns.set(key, expires);
  }

  public canRunAction(cooldownUsage: InternalCooldownConfig) {
    const {
      cooldownType,
      userId,
      actionId,
      guildId = "",
      errorMessage = this._errorMessage,
    } = cooldownUsage;

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
    if (d > 0) time += `${d}d `;
    if (h > 0) time += `${h}h `;
    if (m > 0) time += `${m}m `;
    time += `${s}s`;

    return errorMessage.replace("{TIME}", time);
  }
}

export default Cooldowns;
