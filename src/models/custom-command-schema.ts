import { Schema, model, models } from "mongoose";

const customCommandSchema = new Schema({
  // guildId-commandName
  _id: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

const name = "custom-commands";
export default models[name] || model(name, customCommandSchema);
