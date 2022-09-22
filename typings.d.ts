import {
  Client,
  CommandInteraction,
  Guild,
  GuildMember,
  TextChannel,
  User,
} from 'discord.js'

import Cooldowns from './src/util/Cooldowns'

export default class WOKCommands {
  constructor(options: Options)

  public get testServers(): string[]
  public get botOwners(): string[]
  public get cooldowns(): Cooldowns
  public get disabledDefaultCommands(): string[]
  public get validations(): Validations
  public get commandHandler(): CommandHandler
  public get eventHandler(): EventHandler
  public get isConnectedToDB(): boolean
}

export interface Options {
  client: Client
  mongoUri?: string
  commandsDir?: string
  testServers?: string[]
  botOwners?: string[]
  cooldownConfig?: CooldownConfig
  disabledDefaultCommands?: string[]
  events?: Events
  validations?: Validations
}

export interface CooldownConfig {
  errorMessage: string
  botOwnersBypass: boolean
  dbRequired: number
}

export interface Events {
  dir: string
  [key: string]: any
}

export interface Validations {
  runtime?: string
  syntax?: string
}

export class Cooldowns {
  constructor(instance: WOKCommands, oldownConfig: CooldownConfig) {}
}

export interface CooldownUsage {
  errorMessage?: string
  [key: string]: string
}

export interface InternalCooldownConfig {
  cooldownType: string
  userId: string
  actionId: string
  guildId?: string
  duration?: string
  errorMessage?: string
}

export interface CommandUsage {
  instance: WOKCommands
  message?: Message | null
  interaction?: CommandInteraction | null
  args: string[]
  text: string
  guild?: Guild | null
  member?: GuildMember
  user: User
  channel?: TextChannel
  cancelCooldown?: function
  updateCooldown?: function
}

export interface CommandObject {
  callback: function
  type: CommandType
  description?: string
  testOnly?: boolean
  guildOnly?: boolean
  ownerOnly?: boolean
  permissions?: bigint[]
  deferReply?: 'ephemeral' | boolean
  cooldowns?: CooldownUsage
  minArgs?: number
  maxArgs?: number
  correctSyntax?: string
  expectedArgs?: string
  autocomplete?: function
  reply?: boolean
}

export type FileData = {
  filePath: string
  fileContents: any
}

export enum CommandType {
  SLASH = 'SLASH',
  LEGACY = 'LEGACY',
  BOTH = 'BOTH',
}
