import mongoose from "mongoose";

import CommandHandler from "./command-handler/CommandHandler";
import EventHandler from "./event-handler/EventHandler";
import WOKCommandsType, { Events, Options, Validations } from "../typings";
import Cooldowns from "./util/Cooldowns";
import { Client } from "discord.js";
import Command from "./command-handler/Command";

class WOKCommands {
  private _client!: Client;
  private _testServers!: string[];
  private _botOwners!: string[];
  private _cooldowns: Cooldowns | undefined;
  private _disabledDefaultCommands!: string[];
  private _validations!: Validations;
  private _commandHandler: CommandHandler | undefined;
  private _eventHandler!: EventHandler;
  private _isConnectedToDB = false;

  constructor(options: Options) {
    this.init(options);
  }

  private async init(options: Options) {
    let {
      client,
      mongoUri,
      commandsDir,
      testServers = [],
      botOwners = [],
      cooldownConfig,
      disabledDefaultCommands = [],
      events = {},
      validations = {},
    } = options;

    if (!client) {
      throw new Error("A client is required.");
    }

    if (mongoUri) {
      await this.connectToMongo(mongoUri);
    }

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
    this._disabledDefaultCommands = disabledDefaultCommands.map((cmd: string) =>
      cmd.toLowerCase()
    );
    this._validations = validations;

    this._cooldowns = new Cooldowns(this as WOKCommandsType, {
      errorMessage: "Please wait {TIME} before doing that again.",
      botOwnersBypass: false,
      dbRequired: 300, // 5 minutes
      ...cooldownConfig,
    });

    if (commandsDir) {
      this._commandHandler = new CommandHandler(
        this as WOKCommandsType,
        commandsDir,
        client
      );
    }

    this._eventHandler = new EventHandler(
      this as WOKCommandsType,
      events as Events,
      client
    );
  }

  public get client(): Client {
    return this._client;
  }

  public get testServers(): string[] {
    return this._testServers;
  }

  public get botOwners(): string[] {
    return this._botOwners;
  }

  public get cooldowns(): Cooldowns | undefined {
    return this._cooldowns;
  }

  public get disabledDefaultCommands(): string[] {
    return this._disabledDefaultCommands;
  }

  public get commandHandler(): CommandHandler | undefined {
    return this._commandHandler;
  }

  public get eventHandler(): EventHandler {
    return this._eventHandler;
  }

  public get validations(): Validations {
    return this._validations;
  }

  public get isConnectedToDB(): boolean {
    return this._isConnectedToDB;
  }

  private async connectToMongo(mongoUri: string) {
    await mongoose.connect(mongoUri, {
      keepAlive: true,
    });

    this._isConnectedToDB = true;
  }
}

export default WOKCommands;
module.exports = WOKCommands;

// enum CommandType {
//   SLASH = "SLASH",
//   LEGACY = "LEGACY",
//   BOTH = "BOTH",
// }
// module.exports.CommandType = CommandType;

// enum CooldownTypes {
//   perUser = "perUser",
//   perUserPerGuild = "perUserPerGuild",
//   perGuild = "perGuild",
//   global = "global",
// }
// module.exports.CooldownTypes = CooldownTypes;

// export { CommandType, CooldownTypes, Command };
// module.exports.Command = Command;
