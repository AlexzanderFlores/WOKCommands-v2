import { Message } from "discord.js";

import WOK from "../../../../../typings";

export default async (message: Message, instance: WOK) => {
  const { guild, content } = message;

  const { commandHandler } = instance;
  if (!commandHandler) {
    return;
  }

  const { prefixHandler, commands, customCommands } = commandHandler;

  const prefix = prefixHandler.get(guild?.id);
  if (!content.startsWith(prefix)) {
    return;
  }

  const args = content.split(/\s+/);
  const commandName = args.shift()!.substring(prefix.length).toLowerCase();

  const command = commands.get(commandName);
  if (!command) {
    customCommands.run(commandName, message, null);
    return;
  }

  const { reply, deferReply } = command.commandObject;

  if (deferReply) {
    message.channel.sendTyping();
  }

  const response = await commandHandler.runCommand(
    command,
    args,
    message,
    null
  );
  if (!response) {
    return;
  }

  if (reply) {
    message.reply(response).catch(() => {});
  } else {
    message.channel.send(response).catch(() => {});
  }
};
