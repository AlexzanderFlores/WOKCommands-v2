"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDisabledCommand = exports.DisabledCommandsTypeorm = void 0;
const typeorm_1 = require("typeorm");
const WOK_1 = require("../WOK");
let DisabledCommandsTypeorm = class DisabledCommandsTypeorm {
    guildId;
    cmdName;
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DisabledCommandsTypeorm.prototype, "guildId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DisabledCommandsTypeorm.prototype, "cmdName", void 0);
DisabledCommandsTypeorm = __decorate([
    (0, typeorm_1.Entity)({ name: 'disabled_command' })
], DisabledCommandsTypeorm);
exports.DisabledCommandsTypeorm = DisabledCommandsTypeorm;
const findDisabledCommand = async () => {
    const repo = await WOK_1.ds.getRepository(DisabledCommandsTypeorm);
    const result = await repo.find();
    return !result ? [] : result;
};
exports.findDisabledCommand = findDisabledCommand;
