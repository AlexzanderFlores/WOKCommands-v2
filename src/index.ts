import mongoose from 'mongoose'

import CommandHandler from './command-handler/CommandHandler'
import EventHandler from './event-handler/EventHandler'
import WOKCommandsType, { Events, Options, Validations } from '../typings'
import Cooldowns from './util/Cooldowns'

class WOKCommands {
  private _testServers: string[]
  private _botOwners: string[]
  private _cooldowns: Cooldowns | undefined
  private _disabledDefaultCommands: string[]
  private _validations: Validations
  private _commandHandler: CommandHandler | undefined
  private _eventHandler: EventHandler
  private _isConnectedToDB = false

  constructor(options: Options) {
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
    } = options

    if (!client) {
      throw new Error('A client is required.')
    }

    this._testServers = testServers
    this._botOwners = botOwners
    this._disabledDefaultCommands = disabledDefaultCommands.map((cmd: string) =>
      cmd.toLowerCase()
    )
    this._validations = validations

    if (cooldownConfig) {
      this._cooldowns = new Cooldowns(this as WOKCommandsType, cooldownConfig)
    }

    if (mongoUri) {
      this.connectToMongo(mongoUri)
    }

    if (commandsDir) {
      this._commandHandler = new CommandHandler(
        this as WOKCommandsType,
        commandsDir,
        client
      )
    }

    this._eventHandler = new EventHandler(
      this as WOKCommandsType,
      events as Events,
      client
    )
  }

  public get testServers(): string[] {
    return this._testServers
  }

  public get botOwners(): string[] {
    return this._botOwners
  }

  public get cooldowns(): Cooldowns | undefined {
    return this._cooldowns
  }

  public get disabledDefaultCommands(): string[] {
    return this._disabledDefaultCommands
  }

  public get commandHandler(): CommandHandler | undefined {
    return this._commandHandler
  }

  public get eventHandler(): EventHandler {
    return this._eventHandler
  }

  public get validations(): Validations {
    return this._validations
  }

  public get isConnectedToDB(): boolean {
    return this._isConnectedToDB
  }

  private async connectToMongo(mongoUri: string) {
    await mongoose.connect(mongoUri, {
      keepAlive: true,
    })

    this._isConnectedToDB = true
  }
}

export default WOKCommands
module.exports = WOKCommands

export enum CommandType {
  SLASH = 'SLASH',
  LEGACY = 'LEGACY',
  BOTH = 'BOTH',
}
module.exports.CommandType = CommandType
