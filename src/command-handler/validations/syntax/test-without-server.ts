import Command from "../../Command";

export default (command: Command) => {
  const { instance, commandName, commandObject } = command;

  if (commandObject.testOnly !== true || instance.testServers.length) {
    return;
  }

  throw new Error(
    `Command "${commandName}" is a test only command, but no test servers were specified.`
  );
};
