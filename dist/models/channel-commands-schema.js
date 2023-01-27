"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const channelCommandSchema = new mongoose_1.Schema({
    // guildId-commandName
    _id: {
        type: String,
        required: true,
    },
    channels: {
        type: [String],
        required: true,
    },
});
const name = "channel-commands";
exports.default = mongoose_1.models[name] || (0, mongoose_1.model)(name, channelCommandSchema);
