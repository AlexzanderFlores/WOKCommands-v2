import {
  ApplicationCommandOption,
  Awaitable,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Client,
  Guild,
  GuildMember,
  Message,
  TextChannel,
  User,
} from 'discord.js';
import WOK from './WOK';
import CommandType from './util/CommandType';
import DefaultCommands from './util/DefaultCommands';
import CooldownTypes from './util/CooldownTypes';
import Command from './command-handler/Command';

export interface Events {
  dir: string;
  [key: string]: any;
}

export interface Options {
  client: Client;
  mongoUri?: string;
  commandsDir?: string;
  featuresDir?: string;
  testServers?: string[];
  botOwners?: string[];
  cooldownConfig?: CooldownConfig;
  disabledDefaultCommands?: DefaultCommands[];
  events?: Events;
  validations?: Validations;
  defaultPrefix?: string;
}

export interface Validations {
  runtime?: string;
  syntax?: string;
}

export interface CooldownConfig {
  errorMessage: string;
  botOwnersBypass: boolean;
  dbRequired: number;
}

export interface CommandUsage {
  client: Client;
  instance: WOK;
  message?: Message | null;
  interaction?: ChatInputCommandInteraction | null;
  args: string[];
  text: string;
  guild?: Guild | null;
  member?: GuildMember;
  user: User;
  channel?: TextChannel;
  cancelCooldown?: () => void;
  updateCooldown?: (expires: Date) => void;
}

export interface CooldownUsage {
  errorMessage?: string;
  type: CooldownTypes;
  duration: string;
}

export interface CommandObject {
  callback: (commandUsage: CommandUsage) => unknown;
  type: CommandType;
  init?: (client: Client, instance: WOK) => unknown;
  description?: string;
  aliases?: string[];
  testOnly?: boolean;
  guildOnly?: boolean;
  ownerOnly?: boolean;
  permissions?: bigint[];
  deferReply?: 'ephemeral' | boolean;
  cooldowns?: CooldownUsage;
  minArgs?: number;
  maxArgs?: number;
  correctSyntax?: string;
  expectedArgs?: string;
  options?: ApplicationCommandOption[];
  autocomplete?: (
    command: Command,
    argument: string,
    interaction: AutocompleteInteraction
  ) => Awaitable<(AutocompleteChoice | string)[]>;
  reply?: boolean;
  delete?: boolean;
}

export interface InternalCooldownConfig {
  cooldownType: CooldownTypes;
  userId: string;
  actionId: string;
  guildId?: string;
  duration?: string;
  errorMessage?: string;
}

export type AutocompleteChoice = {
  name: string;
  value: string;
};

export type FileData = {
  filePath: string;
  fileContents: any;
};
