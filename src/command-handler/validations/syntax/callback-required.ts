import Command from "../../Command";

export default (command: Command) => {
  const { commandObject, commandName } = command;

  if (!commandObject.callback) {
    throw new Error(
      `Command "${commandName}" does not have a callback function.`
    );
  }
};
