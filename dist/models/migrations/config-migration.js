"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateConfig = void 0;
const WOK_1 = require("../../WOK");
const config_typeorm_1 = require("../config-typeorm");
const ConfigType_1 = __importDefault(require("../../util/ConfigType"));
const migrateConfig = async () => {
    const repo = WOK_1.ds.getRepository(config_typeorm_1.ConfigTypeorm);
    for (const config of Object.values(ConfigType_1.default)) {
        await repo.query("INSERT IGNORE INTO `configs` (`key`, `isRequireForRun`) VALUES " +
            `('${config}', 0);`);
    }
};
exports.migrateConfig = migrateConfig;
