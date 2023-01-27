"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cooldownSchema = new mongoose_1.Schema({
    // The key from Cooldowns.getKey()
    _id: {
        type: String,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});
const name = "cooldowns";
exports.default = mongoose_1.models[name] || (0, mongoose_1.model)(name, cooldownSchema);
