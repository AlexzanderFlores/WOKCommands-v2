"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const requiredRolesSchema = new mongoose_1.Schema({
    // guildId-commandName
    _id: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true,
    },
});
const name = "required-roles";
exports.default = mongoose_1.models[name] || (0, mongoose_1.model)(name, requiredRolesSchema);
