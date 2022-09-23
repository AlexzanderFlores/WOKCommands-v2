import { Schema, model, models } from "mongoose";

const guildPrefixSchema = new Schema({
  // guild ID
  _id: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
});

const name = "guild-prefixes";
export default models[name] || model(name, guildPrefixSchema);
