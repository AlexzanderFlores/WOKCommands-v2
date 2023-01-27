"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_files_1 = __importDefault(require("./get-all-files"));
class FeaturesHandler {
    constructor(instance, featuresDir, client) {
        this.readFiles(instance, featuresDir, client);
    }
    async readFiles(instance, featuresDir, client) {
        const files = (0, get_all_files_1.default)(featuresDir);
        for (const file of files) {
            let func = require(file.filePath);
            func = func.default || func;
            if (func instanceof Function) {
                await func(instance, client);
            }
        }
    }
}
exports.default = FeaturesHandler;
